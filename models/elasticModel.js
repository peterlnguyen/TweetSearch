var rek = require("rekuire");
var elastical = require("elastical");
var client = new elastical.Client();
var logger = rek("logger").get_log();

var elasticModel = exports = module.exports = {

  /* elasticsearch maintenance functions */

  index_exists: function(index, callback) {
    client.indexExists(index, callback);
  },

  // FIXME: need to figure out options logic
  // basic index creation works with options set to {_type: "tweet"}
  create_index: function(name, options, callback) {
    client.createIndex(name, options, callback);
  },

  delete_index: function(index, callback) {
    // if no index is specified, deletes all indices
    if(!index || index.length == 0) {
      //logger.error("Index cannot be empty: " + index);
      callback({error: 'Index cannot be empty'}, null);
    }
    else client.deleteIndex(index, callback);
  },

  /* elasticsearch action methods */

  index_tweet_bulk: function(tweets, callback) {
    wrapped_tweets = elasticModel.iterate_and_wrap_tweets(tweets);
    client.bulk(wrapped_tweets, callback);
  },

  // search by matching keywords found within tweet contents
  search: function(keywords, callback) {
    elasticModel._search(keywords, callback);
  },

  _search: function(keywords, callback) {
    client.search(
      {
        "query": {
          "match": {
            "description": keywords.description 
          },
        },
        "index": keywords.index,
        "type": "tweet",
        "fields": keywords.fields,
        "size": 10
      },
      callback
    );
  },


  // get index returns the initial, unfiltered list of a user's timeline
  get_index: function(index_name, callback) {
    elasticModel._get_index(index_name, callback);
  },

  // FIXME: fields should be removed after description fix
  _get_index: function(index_name, callback) {
    client.search(
      {
        "query": {
          "match": {
            "screen_name": index_name
          },
        },
        "index": index_name,
        "type": "tweet",
        "fields": ["description", "screen_name"],
        "size": 10,
      },
      callback
    );
  },

  /* converts tweets into filtered json array to bulk index in elastic search */

  iterate_and_wrap_tweets: function(tweets) {
    var wrapped_tweets = [];
    var len = tweets.length;
    for(var i = 0; i < len; i++) {
      var wrapped_tweet = elasticModel.wrap_tweet(tweets[i]);
      wrapped_tweets.push(wrapped_tweet);  
    }
    return wrapped_tweets;
  },

  // FIXME: delete logger
  wrap_tweet: function(tweet) {
    logger.log("tweet: " + tweet);
    var tweet_elastic = {
      "index": {
        "index": tweet["user"]["screen_name"].toLowerCase(),
        "type": "tweet",
        "data": {
          "screen_name": tweet["user"]["screen_name"].toLowerCase(),
          "id": tweet["id"],
          "description": tweet["description"],
          "created_at": tweet["created_at"],
          "user_id": tweet["user"]["id"]
        }
      }
    };
    return tweet_elastic;
  },

  /* deletes all indices */

  destroyDatabase: function(callback) {
    client.deleteIndex(null, callback);
  },

};
