module.exports = (function (server_mg) {
  
  const mg = server_mg,
        router = require('express').Router(),
        moment = require('moment'),
        mealRecord = mg.model("meal_record", {
          name: String,
          time: Date,
          components:[{
            name: String,
            calories: Number,
            protein: Number,
            quantity: Number
          }]
        });
  
  router.post('/query', function(req, res){
    const start = moment.parseZone(req.body.start),
          end = moment.parseZone(req.body.end);
    returnRecord(start,end,res);
  });
  
  router.post('/submit', function(req, res){
    addRecord(req.body,res);
  });
  
  router.delete('/delete/:mealID', function(req, res){
    const mealID = req.params.mealID;
    deleteRecord(mealID, res);
  });
  
  function addRecord(record, res) {
    mealRecord.create(record, function (err, saved_record) {
      if (err) return console.log(err);
      res.json(saved_record);
    });
  }
  
  function deleteRecord(id, res) {
    mealRecord.findByIdAndRemove(id, (err, record) => {
      if (err) return console.log(err);
      res.json(record);
    });
  }
  
  function returnRecord(start, end, res) {
    mealRecord.find({
      time: {
        $gte: start.clone().startOf('day').utc().toDate(),
        $lt: end.clone().endOf('day').utc().toDate()
      }
    }, 
    null, 
    {sort: {time: -1}}, 
    function(err, records) {
      if (err) return console.log(err);
      res.json(records);
    });  
  }  
  return router;
});

function isLoggedIn(req, res, next) {
    console.log(req.isAuthenticated());
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
      console.log("legit user");
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}