var rek = require("rekuire"); var logger = rek("logger").get_log(); 
var twitterModel = rek("twitterModel");
var elasticModel = rek("elasticModel");
var twitterController = rek("twitterController");

// FIXME: used for deletion of indices
var setup = false;

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
      screen_name: "davemcclure",
      text: "Said",
      fields: ["text", "screen_name"]
    };

    elasticModel.search(searchkey, function(error, result) {
      if(error) logger.info("Err: " + JSON.stringify(error));
      else {
        logger.info("Res: " + JSON.stringify(result));
      }
      res.render('index', { title: JSON.stringify(result) });
    });
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
    mainController._get_and_index_timeline("davemcclure", function(error, result) {
      logger.log("Total: " + result.total);
      if(error) res.render('index', { title: 'Error' });
      else res.render('index', { title: JSON.stringify(result) });
    });
  },

  // long and ugly function only used the first time someone enters in a screen name
  _get_and_index_timeline: function(screen_name, callback) {

    //// FIXME: need to detect if tweets actually exist
    //if(!setup) {
      //elasticModel.create_index("tweets", 
    //}

    elasticModel.get_user_tweets(screen_name, function(err, result, res) {
      mainController.handle_error(err, null, callback);

      // if new screen name, GET from twitter and index
      if(result.total == 0) {
        twitterController.get_user_timeline(screen_name, function(err, res) {
          mainController.handle_error(err, res, callback);

          mainController.index_tweet_bulk(res, function(err, res) {
            mainController.handle_error(err, res, callback);

            // give elasticsearch time to store events
            setTimeout(function() {
              elasticModel.get_user_tweets(screen_name, function(err, result, res) {
                mainController.handle_error(err, result, callback);

                callback(err, result);
              });
            }, 1500);

          });
        });

      // else fetch from elasticsearch
      } else {
        callback(err, result);
      }

    });
  },

};
