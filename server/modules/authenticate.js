module.exports = (function (server_passport) {
  const router = require('express').Router(),
        passport = server_passport;
  
  // process the login form
  router.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info){
      if (err) { return next(err); }
      if (!user) { return res.json(false); }
      req.logIn(user, function(err){
        if (err) {return next(err); }
        return res.json(true);
      });
    })(req, res, next);
  });
  
  router.get('/login', function(req, res){
    return res.json(req.isAuthenticated());
  });
  
  return router;
});