var rek = require("rekuire"); var logger = rek("logger").get_log(); 
var twitterModel = rek("twitterModel");
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
      screen_name: "davemcclure",
      text: "Said",
      fields: ["text", "screen_name"]
    };

    elasticModel.search(searchkey, function(error, result) {
      if(error && error != "{}") logger.info("Err: " + JSON.stringify(error));
      else {
        logger.info("Res: " + JSON.stringify(result));
      }
      res.render('index', { title: JSON.stringify(result) });
    });
  },

  // helper function
  handle_error: function(error, result, callback) {
    if(!error) {
      // do nothing
    } else {
      console.log("error: ", error.twitterReply);
      twitter_error = error.twitterReply.errors[0].code;
      console.log("twitter_error: ", twitter_error);
      if(twitter_error && twitter_error == 34) {
        // do nothing
      }
      else if(error != "{}") {
        logger.error("Error in twitter.get_user_timeline: " + JSON.stringify(error));
        callback(error, result);
      }
    }
  },

  // FIXME: check for empty results (i.e. screen_name doesn't exist)
  // interface for view/routing method
  get_and_index_timeline: function(req, res) {
    var screen_name = req.body.screen_name
    mainController._get_and_index_timeline(screen_name, function(error, result) {
      mainController.handle_error(error, result, function() {
        res.render('index', { title: 'Error' });
      });
      //if(error && error != "{}") res.render('index', { title: 'Error' });
      res.render('index', { title: JSON.stringify(result) });
      //res.render('index', { title: JSON.stringify(result) });
    });
  },

  // long and ugly function only used when someone searches for a new screen_name
  _get_and_index_timeline: function(screen_name, callback) {

    elasticModel.get_user_tweets(screen_name, function(err, result, res) {
      mainController.handle_error(err, null, callback);

      // if new screen_name, GET tweet timeline from twitter and index to elasticsearch
      if(result && result.total == 0) {
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
