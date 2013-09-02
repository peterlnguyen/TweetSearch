var assert = require("assert");
var should = require("should");
var rek = require("rekuire");
var logger = rek("logger").get_log();
var elasticModel = rek("elasticModel");


describe("destroyDatabase()", function() {
  it("should return at least one result", function(done) {

    elasticModel.destroyDatabase(function(err, data) {
      should.not.exist(err);
      logger.log("data: " + JSON.stringify(data));
      done();
    });

  })
});

