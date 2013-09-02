var rek = require("rekuire"); var logger = rek("logger").get_log(); var twitterModel = rek("twitterModel");
var elasticModel = rek("elasticModel");
var twitterController = rek("twitterController");

var mainController = exports = module.exports = {

  /* twitter */

  index_tweet_bulk: function(tweets, callback) {
    logger.info("Attempting to index tweets into elasticsearch.");
    elasticModel.index_tweet_bulk(tweets, callback);
  },

  /* elasticsearch */

  // FIXME: redirect to correct views and pass in correct search terms
  search_tweets: function(req, res) {
    logger.info("Attempting to search tweets.");

    var searchkey = {
      index: "justinbieber",
      description: "fans",
      fields: ["description", "screen_name"]
    };

    elasticModel.search(searchkey, function(error, result) {
      if(error) logger.info("Err: " + JSON.stringify(error));
      else {
        logger.info("Res: " + JSON.stringify(result));
      }
      res.render('index', { title: JSON.stringify(result) });
    });
  },

  index_exists: function(index, callback) {
    elasticModel.index_exists(index, callback);
  },


  // helper function
  handle_error: function(error, result, callback) {
    if(error) {
      logger.error("Error in twitter.get_user_timeline: " + JSON.stringify(error));
      callback(error, result);
    }
  },

  // interface for view/routing method
  get_and_index_timeline: function(req, res) {
    mainController._get_and_index_timeline("justinbieber", function(error, result) {
      logger.log("Total: " + result.total);
      if(error) res.render('index', { title: 'Error' });
      else res.render('index', { title: JSON.stringify(result) });
    });
  },

  // FIXME: structure searchkey so that it removems the description parameter
  // long and ugly function only used the first time someone enters in a screen name
  _get_and_index_timeline: function(index_name, callback) {

    var searchkey = {
      index: index_name,
      description: "my fans",
      fields: ["description", "screen_name"]
    };

    elasticModel.index_exists(index_name, function(err, exists) {
      mainController.handle_error(err, null, callback);

      // if new screen name, GET from twitter and index
      if(!exists) {
        twitterController.get_user_timeline(index_name, function(err, res) {
          mainController.handle_error(err, res, callback);

          mainController.index_tweet_bulk(res, function(err, res) {
            mainController.handle_error(err, res, callback);

            elasticModel.search(index_name, function(err, result, res) {
              mainController.handle_error(err, result, callback);

              callback(err, result);
            });
          });
        });

      // else fetch from elasticsearch
      } else {
        elasticModel.get_index(index_name, function(err, result, res) {
          mainController.handle_error(err, result, callback);

          callback(err, result);
        });
      }

    });
  },

};
