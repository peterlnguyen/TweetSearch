var assert = require("assert");
var should = require("should");
var rek = require("rekuire");
var logger = rek("logger").get_log();
var elasticModel = rek("elasticModel");
var elasticHelper = rek("elasticHelper");

describe("Parsing and filtering json tweets to index", function() {
  describe("wrap_tweet()", function() {
    it("should return a json object with correct fields", function() {
      var tweet_ex = { "created_at": "Tue Aug 06 21:54:22 +0000 2013", "id":1234567890, "text":"hello world!", "user":{"id":18002255288,"screen_name":"lukeskywalker"}}
      var wrapped_tweet = elasticHelper.wrap_tweet(tweet_ex)["index"];
      var wrapped_tweet_data = wrapped_tweet["data"];

      assert.equal(wrapped_tweet["index"], "tweets");
      assert.equal(wrapped_tweet["type"], "lukeskywalker");
      assert.equal(wrapped_tweet_data["id"], 1234567890);
      assert.equal(wrapped_tweet_data["text"], "hello world!");
      assert.equal(wrapped_tweet_data["created_at"], "Tue Aug 06 21:54:22 +0000 2013");
      assert.equal(wrapped_tweet_data["user_id"], 18002255288);
    })
  })
});


describe("index interaction methods", function() {

  describe("index_exists()", function() {
    it("should return false for non-existent index", function(done) {
      var rand = Math.random();
      elasticModel.index_exists("gibberish" + rand, function(err, exists) {
        should.not.exist(err);
        (exists).should.be.false;
        done();
      });
    })
  })

  describe("index_create(), index_delete()", function() {
    it("should create a new index and delete it", function(done) {
      elasticModel.create_index("fakeindex", {_type: "nobody"}, function(err, index, data) {
        should.not.exist(err);
        (index).should.be.ok

        elasticModel.index_exists("fakeindex", function(err, exists) {
          should.not.exist(err);
          (exists).should.be.true;

          elasticModel.delete_index("fakeindex", function(err, data) {
            should.not.exist(err);
            data.ok.should.be.true

            elasticModel.index_exists("fakeindex", function(err, exists) {
              should.not.exist(err);
              (exists).should.be.false;

              done();
            });
          });

        });

      });
    })
  })

  // FIXME: should be checking that indices still exist
  describe("index_delete() with no index specified", function() {
    it("should throw an error about specification", function(done) {
      elasticModel.delete_index(null, function(err, data) {
        err.error.should.be.ok;
        should.not.exist(data);
        done();
      });
    })
  })

});
