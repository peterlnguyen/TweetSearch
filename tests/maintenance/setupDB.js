var assert = require("assert");
var should = require("should");
var rek = require("rekuire");
var logger = rek("logger").get_log();
var elasticModel = rek("elasticModel");

describe("create_index()", function() {
  it("should create a clean, new tweets index", function(done) {

    elasticModel.index_exists("tweets", function(err, exists) {
      should.not.exist(err);
      (exists).should.be.false;

        elasticModel.create_index("tweets", null, function(err, index, data) {
          should.not.exist(err);
          (index).should.be.ok;

          done();
        });
    });


  })
});
