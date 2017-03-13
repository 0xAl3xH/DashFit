module.exports = (function (server_mg, mg_URI) {
  
  var mg = server_mg;
  var express = require('express');
  var app = express();
  var router = express.Router();
  var moment = require('moment');
  
  mg.connect(mg_URI);
  
  var weightRecord = mg.model("weight_record", {
    time: Date,
    weight: Number 
  });
  
  function addRecord(jsonItem, res) {
    var record = new weightRecord({
      time: jsonItem.time,
      weight: jsonItem.weight
    });
    record.save(function(err, userRecord){
      if (err) return console.log(err);
      console.log(userRecord);
      res.json(userRecord);
    });
  }
  
  router.get('/', function(req, res){
    bounds = getWeek(moment());
    startWeek = bounds[0];
    endWeek = bounds[1];
    
    console.log(bounds);
    
    weightRecord.find({
      time: {
        $gte: startWeek,
        $lt: endWeek
      }
    }, function(err, records) {
      if (err) return console.log(err);
      console.log(records);
      res.json(records);
    });
  });
  
  router.post('/', function(req, res){
    
  });
  
  return router
});
  
/**
* Given a date of the week, return an array
* containing the [startDate, endDate] of the
* week
*/
function getWeek(date) {
  
  return [date.clone().startOf('week').subtract(4,'days').toDate(), date.clone().endOf('week').subtract(5,'days').toDate()];
}