var rek = require("rekuire");
var elastical = require("elastical");
var client = new elastical.Client();
var logger = rek("logger").get_log();
var elasticHelper = rek("elasticHelper");

var elasticModel = exports = module.exports = {

  /* elasticsearch maintenance functions */

  index_exists: function(index, callback) {
    client.indexExists(index, callback);
  },

  // basic index creation works with options set to {_type: "tweet"}
  // currently not using options
  create_index: function(name, options, callback) {
    client.createIndex(name, options, callback);
  },

  delete_index: function(index, callback) {
    // if no index is specified, deletes all indices
    if(!index || index.length == 0) {
      callback({error: 'Index cannot be empty'}, null);
    }
    else client.deleteIndex(index, callback);
  },

  /* elasticsearch action methods */

  index_tweet_bulk: function(tweets, callback) {
    wrapped_tweets = elasticHelper.iterate_and_wrap_tweets(tweets);
    client.bulk(wrapped_tweets, callback);
  },

  _search: function(keywords, callback) {
    client.search(
      {
        "query": {
          "match": {
            "text": keywords.text 
          },
        },
        "index": "tweets",
        "type": keywords.screen_name,
        "fields": keywords.fields,
        "size": 13
      },
      callback
    );
  },


  // get_user_tweets returns the initial, unfiltered list of a user's timeline
  get_user_tweets: function(screen_name, search_terms, callback) {
    elasticModel._get_user_tweets(screen_name, search_terms, callback);
  },

  _get_user_tweets: function(screen_name, search_terms, callback) {

    var query = 
      {
        "index": "tweets",
        "type": screen_name,
        "fields": ["text", "screen_name"],
        "size": 13,
      };

    if(search_terms && search_terms != undefined) {
      console.log('reaches here');
      console.log("search terms: ", search_terms)
      query["query"] = { "match": { "text": search_terms } }
    }

    logger.info("query: ", query);

    client.search(query, callback);
  },

  /* deletes all indices (when called with empty parameter) */

  destroy_database: function(callback) {
    client.deleteIndex(null, callback);
  },

};
