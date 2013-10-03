
//var elasticExtractor = exports = module.exports = {
  // small, and seemingly unnecessary, but abstraction in case data format changes
  module.exports.extract = function extract(json) {
    content = json.hits;
    tweets = [];
    var len = content.length;

    for(i = 0; i < len; i++) {
      current_tweet = content[i].fields;
      extracted_tweet = {
        text: current_tweet.text,
        screen_name: current_tweet.screen_name,
        created_at: current_tweet.created_at
      };
      tweets.push(extracted_tweet);
    }
    return tweets;
  };

//}; 
