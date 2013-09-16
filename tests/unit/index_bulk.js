var assert = require("assert");
var should = require("should");
var rek = require("rekuire");
var logger = rek("logger").get_log();
var elasticModel = rek("elasticModel");
var elasticHelper = rek("elasticHelper");

var rand_lukeskywalker = Math.random();
var rand_prince = Math.random();
var rand_lukewalton = Math.random();

var tweet_ex = [{ "created_at": "Tue Aug 06 21:54:22 +0000 2013", "id":0101010110, "text": rand_lukeskywalker, "user":{"id":18002255288,"screen_name":"lukeskywalker"}},
                { "created_at": "Tue Dec 15 21:54:22 +0000 2013", "id":1234567890, "text": rand_prince, "user":{"id":13431511,"screen_name":"prince"}},
                { "created_at": "Tue May 39 21:54:22 +0000 2013", "id":9999999999, "text": rand_lukewalton, "user":{"id":4657245,"screen_name":"lukewalton"}}]

describe("index interaction methods", function() {

  describe("index_tweet_bulk()", function() {
    this.timeout(50000);

    it("should not encounter errors after bulk inserts", function(done) {

      elasticModel.index_tweet_bulk(tweet_ex, function(err, res) {
        should.not.exist(err);
        res.should.be.ok;

        var params_lukeskywalker = {
          screen_name: "lukeskywalker",
          text: rand_lukeskywalker,
          fields: ["text", "screen_name"]
        };

        var params_lukewalton = {
          screen_name: "lukewalton",
          text: rand_lukewalton,
          fields: ["text", "screen_name"]
        };

        var params_prince = {
          screen_name: "prince",
          text: rand_prince,
          fields: ["text", "screen_name"]
        };

        // searches have to be nested this way because mocha screws up multiple (non-nested) async callbacks + timeouts
        setTimeout(function() {
            describe("checks each search result against exactly one name and random number match", function() {

              elasticModel.search(params_lukeskywalker, function(err, res) {
                res.total.should.be.equal(1);

                var response = res.hits[0].fields;
                assert.equal(response.screen_name, params_lukeskywalker.screen_name);
                assert.equal(response.text, params_lukeskywalker.text); 

                elasticModel.search(params_lukewalton, function(err, res) {
                  res.total.should.be.equal(1);

                  var response = res.hits[0].fields;
                  assert.equal(response.screen_name, params_lukewalton.screen_name);
                  assert.equal(response.text, params_lukewalton.text); 

                  elasticModel.search(params_prince, function(err, res) {
                    res.total.should.be.equal(1);

                    var response = res.hits[0].fields;
                    assert.equal(response.screen_name, params_prince.screen_name);
                    assert.equal(response.text, params_prince.text); 

                    done();
                  });
                });
              });

            });
        }, 1500);

      });
    });

  });

});
