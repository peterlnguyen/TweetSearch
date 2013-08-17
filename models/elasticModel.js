var elastical = require("elastical");
var client = new elastical.Client();

var elasticModel = exports = module.exports = {

  /* elastic search twitter */

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
        "index": "justinbieber",
        "query": {
          "match": {
            "description": "fan"
          },
        },
        "fields": ["screen_name"],
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
