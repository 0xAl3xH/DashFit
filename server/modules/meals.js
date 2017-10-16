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
    console.log(record);
    const query = {
      _id: record._id
    }
    // No null _id fields allowed
    if (!query._id) {
      query._id = new mg.mongo.ObjectID();
    }
    const update = {
            $setOnInsert:{
              time:record.time
            },
            $set:{
              name: record.name,
              components: record.components
            }
          },
          options = {upsert:true, new:true, setDefaultsOnInsert:true}; //Create a new doc with default schema if not found
    delete record._id;
    console.log(record);
    mealRecord.findOneAndUpdate(query, update, options, function (err, saved_record) {
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
    console.log(start, end);
    mealRecord.find({
      time: {
        $gte: start.toDate(),
        $lt: end.toDate()
      }
    }, 
    null, 
    {sort: {time: 1}}, 
    function(err, records) {
      if (err) return console.log(err);
      res.json(records);
    });  
  }  
  return router;
});