module.exports = (function (server_mg, mg_URI) {
  
  var mg = server_mg;
  var express = require('express');
  var app = express();
  var router = express.Router();
  var moment = require('moment');
  
  var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };   
  
  mg.connect(mg_URI,options);
  
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
    console.log(bounds);
    startWeek = bounds[0];
    endWeek = bounds[1];
    
    weightRecord.find({
      time: {
        $gte: startWeek,
        $lt: endWeek
      }
    }, function(err, records) {
      if (err) return console.log(err);
      var recordsMap = {};
      records.map(function(record) {
        recordsMap[moment(record.time).day()] = [record.weight,record._id];
      });
      console.log(recordsMap);
      var start = moment(startWeek).subtract(1, 'd');
      records = []
      for (var i = 0; i < 7; i++) {
        var date = moment(start).clone().add(i, "d")
        var day = moment(start).clone().add(i, "d").day();
        if (day in recordsMap) {
          records.push({
            id: recordsMap[day][1],
            time: date,
            weight: recordsMap[day][0]
          });
        } else {
          records.push({
            time: date
          });
        }
      }
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