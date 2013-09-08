var keyring = {
  consumer_key: "consumer_key",
  consumer_secret: "consumer_secret",
  access_token: "access_token", 
  access_token_secret: "access_token_secret"
};

var keys = exports = module.exports = {
  get_consumer_key: keyring.consumer_key,
  get_consumer_secret: keyring.consumer_secret,
  get_access_token: keyring.access_token,
  get_access_token_secret: keyring.access_token_secret
};
