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
  
  /**
  * Takes a json item representing a weight record and adds it to the db.
  * If a record exists with the same date, update it with the new weight info.
  **/
  function addRecord(jsonItem, res) {
    var momentTime = moment(new Date(jsonItem.time)).utc(),
        query = {
          time: {
            $gte: momentTime.clone().startOf('day').toDate(),
            $lt: momentTime.clone().endOf('day').toDate()
          }
        },
        update = {
          $setOnInsert:{time:jsonItem.time}, 
          $set:{weight: jsonItem.weight}
        },
        options = {upsert:true, new:true, setDefaultsOnInsert:true}; //Create a new doc with default schema if not found
    
    weightRecord.findOneAndUpdate(query, update, options, function(err, result){
      if (err) return console.log(err);
      console.log("Saved/modified:" + result);
      res.status(200).json(result);
    });
  }
  
  function returnRecord(time, res) {
    bounds = getWeek(time);
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
      var start = moment(startWeek).utc().startOf('day');
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
  }
  
  router.post('/query', function(req, res){
    var time = moment(new Date(req.body.time)).utc();
    console.log(time);
    returnRecord(time,res);
  });
  
  router.post('/submit', function(req, res){
    console.log(req.body);
    addRecord(req.body,res);
  });
  
  return router
});
  
/**
* Given a date of the week, return an array
* containing the [startDate, endDate] of the
* week
*/

function getWeek(date) {
  var start = date.clone().subtract((date.clone().day() + 7 - 2)%7,'days');
  var end = start.clone().add(6, 'days');
  return [start.utc().startOf('day').toDate(), end.utc().endOf('day').toDate()];
}