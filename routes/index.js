var rek = require("rekuire");
var mainController = rek("mainController");
var twitterController = rek("twitterController");
var logger = rek("logger").get_log();
var elasticModel = rek("elasticModel");

var index = exports = module.exports = {

  index: function(req, res) {
    res.render('index', { title: 'Express' });
  },


  get_user_timeline: function(req, res) {
    mainController.get_and_index_timeline(req, res);
    res.render('index', { title: 'Express' });
  },

  // FIXME: only for testing purposes, delete after.
  quicksearch: function(req, res) {
    elasticModel.search("justinbieber", function(err, res) {
      logger.erorr("Err: " + JSON.stringify(err));
      logger.info("Res: " + JSON.stringify(res));
    });
  },

};
