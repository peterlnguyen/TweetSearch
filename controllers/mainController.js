var rek = require("rekuire");
var logger = rek("logger").get_log();
var twitterModel = rek("twitterModel");
var elasticModel = rek("elasticModel");
var twitterController = rek("twitterController");

// FIXME: temp, delete after
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

  search_tweets: function(req, res) {
    logger.info("Attempting to search tweets.");
    elasticModel.search(searchkey, function(err, res) {
      if(err) logger.info("Err: " + JSON.stringify(err));
      else {
        logger.info("Res: " + JSON.stringify(res));
      }
      res.render('Search Results', { title: 'Whatevz' });
    });
  },


  // long and ugly function only usesd the first time someone enters in a screen name
  get_and_index_timeline: function(keywords, callback) {

    twitterController.get_user_timeline("justinbieber", function(err, res) {
      if(err) logger.error("Error while sending GET request for tweets: " + JSON.stringify(err));
      else {
        logger.info("Succesfully reply from twitter api.");

        mainController.index_tweet_bulk(res, function(err, res) {
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
