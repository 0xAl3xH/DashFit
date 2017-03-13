var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var router = express.Router();

app.use(bodyParser.json());
app.use('/',router);
app.use(express.static(__dirname + '/../client/build'));

console.log("Server started, listening on port 3000");
http.listen(3000);