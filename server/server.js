const fs = require('fs'),
      configFields = JSON.parse(fs.readFileSync("config_fields.json", "utf8")),
      configFileName = "config.json",
      config = JSON.parse(fs.readFileSync(configFileName, "utf8"));
for (var field in configFields) {
    if (!(field in config)) {
        var value = configFields[field];
        if (value.default) {
            config[field] = value.default;
        } else if (value.required) {
            console.error("The following field was not provided in the config file and does not have a default value:");            
            console.error("Field name: %s", field);
            console.error("Field description: %s", value.description);
            process.exit(1);
        }       
    }       
}

const express = require('express'),
      app = express(),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      http = require('http').Server(app),
      router = express.Router(),
      mg = require('mongoose').connect(config.mongoURI,config.mogoOptions), 
      conn = mg.connection,
      morgan = require('morgan'),
      passport = require('passport'),
      session = require('express-session'),
      expressStaticGzip = require("express-static-gzip"),
      logWeight = require('./modules/weight.js')(mg, passport),
      authenticate = require('./modules/authenticate.js')(passport);

require('./modules/config/passport.js')(passport);

app.use(morgan('dev'));
app.use(cookieParser(config.sessionSecret));
app.use(bodyParser.json());
app.use("/", expressStaticGzip(__dirname + '/../client/build'));

// Passport settings
app.use(session({ secret: config.sessionSecret, 
                  resave: false, 
                  saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use(authenticate);
app.use('/weight', isLoggedIn, logWeight);

// wait for db connection to be established before starting server
conn.once('open', function(){
  console.log("Server started, listening on port 3000");
  http.listen(3000);
});

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}