/**
* Module that is responsible for handling transaction for daily
* reviews.
* @param server_mg an instance of Mongoose which has been connected
**/

module.exports = (function (server_mg) {
  
  const mg = server_mg,
        router = require('express').Router(),
        moment = require('moment'),
        reviewRecord = mg.model("review_record", {
          time: Date,
          rating: Number,
          comment: String,
        });
  
  router.post('/query', function(req, res){
    const start = moment.parseZone(req.body.start),
          end = moment.parseZone(req.body.end);
    console.log(start,end);
    returnRecord(start,end,res);
  });
  
  router.post('/submit', function(req, res){
    const review = req.body.review;
    console.log(req.body.review);
    addRecord(review,res);
  });
  
  /**
  * Adds a record to the db. If a record exists in the db with
  * the same date, update it with new ratings and comments.
  * @param record an object representing a review record
  * @param res the response object for the request
  **/
  function addRecord(record, res) {
    const momentTime = moment.parseZone(record.date),
          query = {
            time: {
              $gte: momentTime.clone().startOf('day').toDate(),
              $lt: momentTime.clone().endOf('day').toDate()
            }
          },
          update = {
            $setOnInsert: {time:momentTime.toDate()}, 
            $set: {
              comment: record.comment,
              rating: record.rating,
            }
          },
          options = {upsert:true, new:true, setDefaultsOnInsert:true}; //Create a new doc with default schema if not found
    reviewRecord.findOneAndUpdate(query, update, options, function(err, result){
      if (err) return console.log(err);
      res.status(200).json(result);
    });
  }
  
  /**
  * Returns the records within the specified range of time.
  * If a record does not exist on a particular day 
  * the returned object will just be that date with no 
  * other fields.
  * @param start a moment instance
  * @param end a moment instance 
  * @param res the response object for the request
  **/
  function returnRecord(start, end, res) {
    reviewRecord.find({
      time: {
        $gte: start.toDate(),
        $lt: end.toDate()
      }
    }, function(err, record) {
      if (err) return console.log(err);
      res.json(record);
    });  
  }  
  return router;
});