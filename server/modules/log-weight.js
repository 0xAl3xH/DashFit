/**
* Module that is responsible for handling transaction for logging 
* user weight. 
* @param server_mg an instance of Mongoose which has been connected
**/

module.exports = (function (server_mg) {
  
  const mg = server_mg,
        express = require('express'),
        app = express(),
        router = express.Router(),
        moment = require('moment'),
        options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } },
        weightRecord = mg.model("weight_record", {
          time: Date,
          weight: Number 
        });
  
  router.post('/query', function(req, res){
    const time = moment(new Date(req.body.time));
    returnRecord(time,res);
  });
  
  router.post('/submit', function(req, res){
    addRecord(req.body,res);
  });
  
  /**
  * Adds a record to the db. If a record exists in the db with
  * the same date, update it with the new weight info.
  * @param record an object representing a weight
  * @param res the response object for the request
  **/
  function addRecord(record, res) {
    const momentTime = moment(new Date(record.time)),
          query = {
            time: {
              //@TODO figure out if the usage of .utc() is necessary 
              $gte: momentTime.clone().startOf('day').utc().toDate(),
              $lt: momentTime.clone().endOf('day').utc().toDate()
            }
          },
          update = {
            $setOnInsert:{time:record.time}, 
            $set:{weight: record.weight}
          },
          options = {upsert:true, new:true, setDefaultsOnInsert:true}; //Create a new doc with default schema if not found
    weightRecord.findOneAndUpdate(query, update, options, function(err, result){
      if (err) return console.log(err);
      res.status(200).json(result);
    });
  }
  
  /**
  * Returns the records for the "week" given any day of the week
  * @param time a Moment instance
  * @param res the response object for the request
  **/
  function returnRecord(time, res) {
    let bounds = getWeek(time),
        startWeek = bounds[0],
        endWeek = bounds[1];
    
    weightRecord.find({
      time: {
        $gte: startWeek,
        $lt: endWeek
      }
    }, function(err, records) {
      if (err) return console.log(err);
      const recordsMap = {};
      records.map(function(record) {
        recordsMap[moment(record.time).startOf('day').utc()] = [record.weight, record._id, record.time];
      });
      const start = moment(startWeek).startOf('day').utc();
      records = []
      for (var i = 0; i < 7; i++) {
        var date = moment(start).clone().add(i, "d")
        if (date in recordsMap) {
          records.push({
            id: recordsMap[date][1],
            time: recordsMap[date][2],
            weight: recordsMap[date][0]
          });
        } else {
          records.push({
            time: date
          });
        }
      }
      res.json(records);
    });  
  }  
  return router
});
  
/**
* Given a date of the week, return an array
* containing the [startDate, endDate] of the
* week
* @param date a Moment instance
*/

function getWeek(date) {
  var start = date.clone().subtract((date.clone().day() + 7 - 2)%7,'days');
  var end = start.clone().add(6, 'days');
  return [start.startOf('day').utc().toDate(), end.endOf('day').utc().toDate()];
}