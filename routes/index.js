var rek = require("rekuire");
var mainController = rek("mainController");
var twitterController = rek("twitterController");
var logger = rek("logger").get_log();

var index = exports = module.exports = {

  index: function(req, res) {
    res.render('index', { title: 'Express' });
  },


  get_user_timeline: function(req, res) {
    mainController.get_and_index_timeline(req, res);
    res.render('index', { title: 'Express' });
  },

  search_tweets: function(req, res) {
    mainController.search_tweets(req, res);
  },

};
