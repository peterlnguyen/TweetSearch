var rek = require("rekuire");
var logger = rek("logger").get_log();
var twitterModel = rek("twitterModel");

var twitterController = exports = module.exports = {

  get_user_timeline: function(screen_name, callback) {
    twitterModel.get_user_timeline(screen_name, callback);
  },

};
