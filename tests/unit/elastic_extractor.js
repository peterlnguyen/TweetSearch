var assert = require("assert");
var should = require("should");
var rek = require("rekuire");
var logger = rek("logger").get_log();
var extractor = rek("elasticExtractor");

describe("elasticsearch json extractor", function() {

    it("should extract appropriate fields", function() {

      var json = {"total":20,"max_score":1,"hits":[
        {"_index":"tweets","_type":"stephenathome","_id":"LyNHyXT9QtWEQkYcjtKZLg","_score":1,
          "fields":{"created_at":"Wed Sep 11 01:10:53 +0000 2013","text":"Tonight: I take a break from depressing stuff like Syria to discuss depressing stuff like J.D. Salinger. @ColbertReport, 11:30 p.m.","screen_name":"stephenathome"}},
        {"_index":"tweets","_type":"stephenathome","_id":"0rceGcbZQxGtJQ05LqEinQ","_score":1,
          "fields":{"created_at":"Thu Sep 26 13:15:09 +0000 2013","text":"Anybody seen my pancake mix? Couldn't find it in the cabinet so I figured I'd ask you guys.","screen_name":"stephenathome"}
        }]}

      tweets = extractor.extract(json);

      console.log(tweets);

      tweets[0].text.should.be.ok;
      tweets[0].created_at.should.be.ok;
      tweets[0].screen_name.should.be.ok;

      tweets[1].text.should.be.ok;
      tweets[1].created_at.should.be.ok;
      tweets[1].screen_name.should.be.ok;
    });

});
