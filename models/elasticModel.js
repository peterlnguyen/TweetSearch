var elastical = require("elastical");
var client = new elastical.Client();

var elasticModel = exports = module.exports = {

  /* elasticsearch maintenance functions */

  index_exists: function(index, callback) {
    client.indexExists(index, callback);
  },

  // FIXME: not done
  create_index: function(name, options, callback) {
    client.createIndex(name, options, callback);
  },

  delete_index: function(index, callback) {
    // if no index is specified, deletes all indices
    if(!index || index.length == 0) {
      log.error("Index cannot be empty: " + index);
      callback("{Error: 'Index cannot be empty}'", null);
    }
    else client.deleteIndex(index, callback);
  },

  /* elasticsearch action methods */

  index_tweet_bulk: function(tweets, callback) {
    wrapped_tweets = elasticModel.iterate_and_wrap_tweets(tweets);
    client.bulk(wrapped_tweets, callback);
  },

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

  wrap_tweet: function(tweet) {
    var tweet_elastic = {
      "index": {
        "index": tweet["user"]["screen_name"].toLowerCase(),
        "type": "tweet",
        "data": {
          "id": tweet["id"],
          "description": tweet["description"],
          "created_at": tweet["created_at"],
          "user_id": tweet["user"]["id"]
        }
      }
    };
    return tweet_elastic;
  },

};
