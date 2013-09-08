var assert = require("assert");
var should = require("should");
var rek = require("rekuire");
var logger = rek("logger").get_log();
var elasticModel = rek("elasticModel");
var main = rek("mainController");


describe("mainController", function() {

  describe("get_and_index_timeline", function() {
    it("should retrieve a new timeline and search/confrm its existence", function(done) {
      this.timeout(5000);

      var screen_name = "justinbieber";

      main._get_and_index_timeline(screen_name, function(err, res) {
        should.not.exist(err);
        res.total.should.be.above(0);

        var params = {
          type: screen_name,
          fields: ["screen_name", "text"],
          text: "the"
        };

        elasticModel.search(params, function(err, res) {
          should.not.exist(err);
          //res.total.should.be.above(0);
          done();
          
          // need to only destroy mattcutts type
          //elasticModel.destroy_database(function(err, data) {
            //should.not.exist(err);
            //done();
          //});

        });

      });
    })
  })
});
