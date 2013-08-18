var rek = require("rekuire");
var logger = rek("logger").get_log();
var twitterModel = rek("twitterModel");
var elasticModel = rek("elasticModel");
var twitterController = rek("twitterController");

// FIXME: delete this after?
var searchkey = {
  index: "justinbieber",
  description: "fans",
  fields: ["description", "screen_name"]
};

var mainController = exports = module.exports = {

  /* index tweets */

  index_tweet_bulk: function(tweets, callback) {
    logger.info("Attempting to index tweets into elasticsearch.");
    elasticModel.index_tweet_bulk(tweets, callback);
  },


  get_and_index_timeline: function(req, res) {

    twitterController.get_user_timeline("justinbieber", function(err, reply) {
      if(err) logger.error("Error while sending GET request for tweets: " + JSON.stringify(err));
      else {
        logger.info("Succesfully reply from twitter api.");
        mainController.index_tweet_bulk(reply, function(err, res) {
          if(err) logger.error("Error while indexing tweets: " + JSON.stringify(err));
          else {
            logger.info("Successfully indexed tweets.");
            elasticModel.search(searchkey, function(err, results, res) {
              if(err) logger.error("Error while searching elasticsearch: " + err);
              else {
                logger.info("Successfully queried elasticsearch.");
                logger.info("Results: " + JSON.stringify(results));
              }
            });
          }
        });
      }
    });
  },

};
