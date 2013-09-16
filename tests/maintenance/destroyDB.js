var assert = require("assert");
var should = require("should");
var rek = require("rekuire");
var logger = rek("logger").get_log();
var elasticModel = rek("elasticModel");

describe("destroy_database()", function() {
  it("should destroy the tweets index", function(done) {

    elasticModel.destroy_database(function(err, data) {
      should.not.exist(err);

      elasticModel.index_exists("tweets", function(err, exists) {
        should.not.exist(err);
        (exists).should.be.false;

        done();
      });

    });

  })
});

