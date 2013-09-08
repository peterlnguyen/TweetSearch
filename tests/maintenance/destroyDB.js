var assert = require("assert");
var should = require("should");
var rek = require("rekuire");
var logger = rek("logger").get_log();
var elasticModel = rek("elasticModel");

describe("destroyDatabase()", function() {
  it("should destroy and create a clean index", function(done) {

    elasticModel.destroy_database(function(err, data) {
      should.not.exist(err);

      elasticModel.create_index("tweets", null, function(err, index, data) {
        should.not.exist(err);
        (index).should.be.ok;
        done();
      });
    });

  })
});

