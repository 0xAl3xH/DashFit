/**
* Module that is responsible for handling transaction for logging 
* user weight. 
* @param server_mg an instance of Mongoose which has been connected
**/

module.exports = (function (server_mg, server_passport) {
  
  const mg = server_mg,
        router = require('express').Router(),
        moment = require('moment'),
        weightRecord = mg.model("weight_record", {
          time: Date,
          weight: Number 
        });
  
  router.post('/query', function(req, res){
    //Start and end MUST be a moment parseable string with timezone preserved
    const start = moment(req.body.start),
          end = moment(req.body.end);
    console.log(start.format(),end.format());
    returnRecord(start,end,res);
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
    const momentTime = moment.parseZone(record.time),
          query = {
            time: {
              $gte: momentTime.clone().startOf('day').toDate(),
              $lt: momentTime.clone().endOf('day').toDate()
            }
          },
          update = {
            $setOnInsert:{time:momentTime.toDate()}, 
            $set:{weight: record.weight}
          },
          options = {upsert:true, new:true, setDefaultsOnInsert:true}; //Create a new doc with default schema if not found
    weightRecord.findOneAndUpdate(query, update, options, function(err, result){
      if (err) return console.log(err);
      res.status(200).json(result);
    });
  }
  
  /**
  * Returns the records within the specified range of time
  * by day.
  * @param start a moment instance
  * @param end a moment instance 
  * @param res the response object for the request
  **/
  function returnRecord(start, end, res) {
    let numDays = end.clone().diff(start.clone(),'days') + 1;
    console.log(numDays);
    //TODO: Find more efficient way to do this
    weightRecord.find({
      time: {
        $gte: start.clone().toDate(),
        $lt: end.clone().toDate()
      }
    }, function(err, records) {
      if (err) return console.log(err);
//      const recordsMap = {};
//      records.map(function(record) {
//        recordsMap[moment(record.time).format('M-D-Y')] = [record.weight, record._id, record.time];
//      });
//      const startDay = start.clone().utc();
//      records = []
//      for (var i = 0; i < numDays; i++) {
//        let date = startDay.clone().add(i, "d");
//        let day = date.format('M-D-Y');
//        console.log(date, day, recordsMap);
//        if (day in recordsMap) {
//          records.push({
//            id: recordsMap[day][1],
//            time: recordsMap[day][2],
//            weight: recordsMap[day][0]
//          });
//        } else {
//          records.push({
//            time: date,
//          });
//        }
//      }
//      console.log(records, records.length);
//      res.json(records);
      console.log(records);
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