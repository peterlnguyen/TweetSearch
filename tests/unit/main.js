var assert = require("assert");
var rek = require("rekuire");
var logger = rek("logger").get_log();
var main = rek("mainController");

describe("Parsing and filtering json tweets to index", function() {

  var tweet_ex = [{ "created_at": "Tue Aug 06 21:54:22 +0000 2013", "id":364867069524709376, "description":"#BELIEVE is on ITUNES and in STORES WORLDWIDE! - SO MUCH LOVE FOR THE FANS...you are always there for me and I will always be there for you. MUCH LOVE. thanks", "user":{"id":27260086,"screen_name":"blahblah"}}, { "created_at": "Tue Aug 06 21:54:22 +0000 2013", "id":364867069524709376, "description":"#BELIEVE is on ITUNES and in STORES WORLDWIDE! - SO MUCH LOVE FOR THE FANS...you are always there for me and I will always be there for you. MUCH LOVE. thanks", "user":{"id":27260086,"screen_name":"thedude"}}]

  describe("wrap_tweet()", function() {
    it("should return a json object with correct fields", function() {
      var tweet_ex = { "created_at": "Tue Aug 06 21:54:22 +0000 2013", "id":1234567890, "description":"hello world!", "user":{"id":18002255288,"screen_name":"lukeskywalker"}}
      var wrapped_tweet = main.wrap_tweet(tweet_ex)["index"];
      var wrapped_tweet_data = wrapped_tweet["data"];

      assert.equal(wrapped_tweet["index"], "lukeskywalker");
      assert.equal(wrapped_tweet["type"], "tweet");
      assert.equal(wrapped_tweet_data["id"], 1234567890);
      assert.equal(wrapped_tweet_data["description"], "hello world!");
      assert.equal(wrapped_tweet_data["created_at"], "Tue Aug 06 21:54:22 +0000 2013");
      assert.equal(wrapped_tweet_data["user_id"], 18002255288);
    })
  })

});
