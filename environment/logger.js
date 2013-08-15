var winston = require("winston");

var config = {
  colors: {
    "verbose": "cyan",
    "info": "green",
    "data": "grey",
    "warn": "yellow",
    "debug": "blue",
    "error": "red"
  }
};

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      "timestamp": true,
      "colorize": true
    }),
    new (winston.transports.File)({
      "filename": "tests.log",
      "timestamp": true
    })
  ],
  colors: config.colors
});

var environment = exports = module.exports = {

  get_log: function() {
    return logger;
  },
  
};
