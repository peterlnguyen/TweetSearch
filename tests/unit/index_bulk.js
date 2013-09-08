var assert = require("assert");
var should = require("should");
var rek = require("rekuire");
var logger = rek("logger").get_log();
var elasticModel = rek("elasticModel");
var elasticHelper = rek("elasticHelper");

describe("index interaction methods", function() {

  describe("index_tweet_bulk()", function() {
    this.timeout(50000);

    describe("index test tweets", function() {
    //it("should exist after bulk exist", function(done) {

      rand_lukeskywalker = Math.random();
      rand_prince = Math.random();
      rand_lukewalton = Math.random();

      var tweet_ex = [{ "created_at": "Tue Aug 06 21:54:22 +0000 2013", "id":0101010110, "text": rand_lukeskywalker, "user":{"id":18002255288,"screen_name":"lukeskywalker"}},
                      { "created_at": "Tue Dec 15 21:54:22 +0000 2013", "id":1234567890, "text": rand_prince, "user":{"id":13431511,"screen_name":"prince"}},
                      { "created_at": "Tue May 39 21:54:22 +0000 2013", "id":9999999999, "text": rand_lukewalton, "user":{"id":4657245,"screen_name":"lukewalton"}}]

      it("should exist after bulk exist", function(done) {

        elasticModel.index_tweet_bulk(tweet_ex, function(err, res) {
          logger.info("err: " + JSON.stringify(err));
          logger.info("res: " + JSON.stringify(res));

          should.not.exist(err);
          res.should.be.ok;
          //done();

          it("should return return a result of at least 1", function(done) {
            var params_lukeskywalker = {
              screen_name: "lukeskywalker",
              text: rand_lukeskywalker,
              fields: ["text", "screen_name"]
            };

            elasticModel.search(params_lukeskywalker, function(err, res) {
              logger.info("err: " + JSON.stringify(err));
              logger.info("res: " + JSON.stringify(res));
              res.total.should.be.above(0);
              done();
            });
          });

        });

      });

    });

          //setTimeout(function() {
    //describe("search for indexed tweets", function() {
    //it("should whatever", function() {

      //setTimeout(function() {
        //it("should return return a result of at least 1", function(done) {
          //var params_lukeskywalker = {
            //screen_name: "lukeskywalker",
            //text: rand_lukeskywalker,
            //fields: ["text", "screen_name"]
          //};
//
            //elasticModel.search(params_lukeskywalker, function(err, res) {
              //logger.info("err: " + JSON.stringify(err));
              //logger.info("res: " + JSON.stringify(res));
              //res.total.should.be.above(0);
              //done();
            //});
        //});
//
        //it("should return return a result of at least 1", function(done) {
          //var params_prince = {
            //screen_name: "prince",
            //text: rand_prince,
            //fields: ["text", "screen_name"]
          //};
//
          //elasticModel.search(params_prince, function(err, res) {
            //logger.info("err: " + JSON.stringify(err));
            //logger.info("res: " + JSON.stringify(res));
            //done();
          //});
        //});
//
        //it("should return return a result of at least 1", function(done) {
          //var params_lukewalton = {
            //screen_name: "lukewalton",
            //text: rand_lukewalton,
            //fields: ["text", "screen_name"]
          //};
//
          //elasticModel.search(params_lukewalton, function(err, res) {
            //logger.info("err: " + JSON.stringify(err));
            //logger.info("res: " + JSON.stringify(res));
            //res.total.should.be.above(0);
            //done();
          //});
        //});

      //}, 0);
    //});

  });

});
