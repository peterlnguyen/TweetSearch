/* read in pre-made tweets.txt */

fs = require('fs');

exports.test_load = function(req, res) {
    tweets = load_tweets();
      iterate_tweets(tweets);
};

function load_tweets() {
  var file_data;
  fs.readFile('./2tweets.txt', 'utf8', function(err, data) {
    if(err) {
      return console.log(err);
    } else {
      return JSON.stringify(data);
    }
  });
};

