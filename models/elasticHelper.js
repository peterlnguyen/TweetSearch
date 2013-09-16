var rek = require("rekuire");
var logger = rek("logger").get_log();

var elasticHelper = exports = module.exports = {

  /* converts tweets into filtered json array to bulk index in elastic search */

  iterate_and_wrap_tweets: function(tweets) {
    var wrapped_tweets = [];
    var len = tweets.length;
    for(var i = 0; i < len; i++) {
      var wrapped_tweet = elasticHelper.wrap_tweet(tweets[i]);
      wrapped_tweets.push(wrapped_tweet);  
    }
    return wrapped_tweets;
  },

  wrap_tweet: function(tweet) {
    var screen_name = tweet["user"]["screen_name"].toLowerCase();
    var tweet_elastic = {
      "index": {
        "index": "tweets",
        "type": screen_name,
        "data": {
          "screen_name": screen_name,
          "id": tweet["id"],
          "text": tweet["text"],
          "created_at": tweet["created_at"],
          "user_id": tweet["user"]["id"]
        }
      }
    };
    return tweet_elastic;
  },

  //converts the stupid created_at stamp twitter uses
  get_unix_timestamp: function(created_at) {
    date = moment.parse(created_at);
    timestamp = moment.unix(date);
    return timestamp; 
  },

};
