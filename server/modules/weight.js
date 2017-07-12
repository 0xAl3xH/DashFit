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
    const start = moment.parseZone(req.body.start),
          end = moment.parseZone(req.body.end);
    console.log(start,end);
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
              //@TODO figure out if the usage of .utc() is necessary 
              $gte: momentTime.clone().startOf('day').utc().toDate(),
              $lt: momentTime.clone().endOf('day').utc().toDate()
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
  * by day. If a record does not exist on a particular day 
  * the returned object will just be that date with no 
  * other fields.
  * @param start a moment instance
  * @param end a moment instance 
  * @param res the response object for the request
  **/
  function returnRecord(start, end, res) {
    let offset = start.utcOffset();
    const numDays = end.clone().startOf('day').diff(start.clone().startOf('day'),'days') + 1;
    //TODO: Find more efficient way to do this
    weightRecord.find({
      time: {
        $gte: start.clone().startOf('day').utc().toDate(),
        $lt: end.clone().endOf('day').utc().toDate()
      }
    }, function(err, records) {
      if (err) return console.log(err);
      const recordsMap = {};
      records.map(function(record) {
        recordsMap[moment(record.time).utcOffset(offset).startOf('day')] = [record.weight, record._id, record.time];
      });
      const startDay = start.clone().startOf('day');
      records = []
      for (var i = 0; i < numDays; i++) {
        let date = startDay.clone().add(i, "d");
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