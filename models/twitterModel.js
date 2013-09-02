var rek = require("rekuire");
var twit = require("twit");
var keys = rek("keys");

var twitClient  = new twit({
  consumer_key: "ox3svi5a0uN7m99n23tw",
  consumer_secret: "EHI6FmIdilxqjjvmKDcfJuTWqf2mGWxjw2Vdh3ZEVVc",
  access_token: "308676043-d5TDPY8Z648XKCQqIIgrFzNQ3cVQxPXxWpgdmE",
  access_token_secret: "90QQwvC90Z29fOE0Ye7GvuvCTXuygDa6PBgrU3DS8"
});

var twitterModel = exports = module.exports = {

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
