const fs = require('fs'),
      configFields = JSON.parse(fs.readFileSync("config_fields.json", "utf8")),
      configFileName = "config.json",
      config = JSON.parse(fs.readFileSync(configFileName, "utf8")),
      configErrors = false;
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

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      http = require('http').Server(app),
      router = express.Router(),
      mg = require('mongoose').connect(config.mongoURI), 
      conn = mg.connection,
      morgan = require('morgan'),
      passport = require('passport'),
      session = require('express-session'),
      logWeight = require('./modules/log-weight.js')(mg);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/weight',logWeight);
app.use(express.static(__dirname + '/../client/build'));

// required for passport
app.use(session({ secret: '2lqozlZKSJPujynYxWnQGEamJszfbeXR' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// wait for db connection to be established before starting server
conn.once('open', function(){
  console.log("Server started, listening on port 3000");
  http.listen(3000);
});