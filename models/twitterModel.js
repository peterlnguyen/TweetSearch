var rek = require("rekuire");
var twit = require("twit");
var keys = rek("keys");

var twitClient  = new twit({
  consumer_key: keys.get_consumer_key,
  consumer_secret: keys.get_consumer_secret,
  access_token: keys.get_access_token,
  access_token_secret: keys.get_access_token_secret
});

var twitterModel = exports = module.exports = {

  // FIXME: change count to 200
  get_user_timeline: function(screen_name, callback) {
    twitClient.get("statuses/user_timeline", 
    { 
      "screen_name": screen_name,
      "count": 200,
      "include_rts": 1,
    },
    callback);
  },
    
};
