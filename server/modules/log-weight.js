module.exports = function (server_mg, mg_URI) {
  var mg = server_mg;
  var express = require('express');
  var app = express();
  var router = express.Router();
  
  mg.connect(mg_URI);
  
  return router
}