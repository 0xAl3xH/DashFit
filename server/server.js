var fs = require('fs');

var configFields = JSON.parse(fs.readFileSync("config_fields.json", "utf8"));

var configFileName = "config.json";

var config = JSON.parse(fs.readFileSync(configFileName, "utf8"));

var configErrors = false;
for (var field in configFields) {
    if (!(field in config)) {
        var value = configFields[field];
        if (value.default) {
            config[field] = value.default;
        } else if (value.required) {
            logger.error("The following field was not provided in the config file and does not have a default value:");            logger.error("Field name: %s", field);
            logger.error("Field description: %s", value.description);
        }       
    }       
}
if (configErrors) {
    process.exit(1);
}

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var router = express.Router();
var mg = require('mongoose');
var logWeight = require('./modules/log-weight.js')(mg,config.mongoURI);

app.use(bodyParser.json());
app.use('/',router);
app.use(express.static(__dirname + '/../client/build'));

console.log("Server started, listening on port 3000");
http.listen(3000);