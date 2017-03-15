var fs = require('fs'),
    moment = require('moment'),
    config = JSON.parse(fs.readFileSync('../config.json', "utf8")),
    rawWeightData = JSON.parse(fs.readFileSync('date-weight.json', "utf8")),
    mg = require('mongoose'),
    options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                  replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

mg.connect(config.mongoURI,options);

var weightRecord = mg.model("weight_record", {
  time: Date,
  weight: Number 
});

/**
* Expects array of objets that contain time and weight
* extract the fields and puts in new object array
**/
function proccessRawData(weightData){
  var records = [];
  for (var i = 0; i < weightData.length; i ++) {
    var entry = weightData[i];
    if (entry.Date && entry.Weight) {
      records.push(
        {
          time: entry.Date,
          weight: entry.Weight
        }
      );
    }
  }
  return records;
}

function uploadData(data) {
  var duplicates_memo = {};
  var duplicates = [];
  for (var i = 0; i < data.length; i++) {
    var entry = data[i];
    console.log(entry);
    console.log(moment(entry.time,'M/D/YY').startOf('day').utc(), moment(entry.time,'M/D/YY'));
    var db_entry = new weightRecord({
      time:moment(entry.time,'M/D/YY').startOf('day').utc().toDate(), 
      weight:parseFloat(entry.weight).toFixed(1)
    });
    
    if (moment(entry.time,'M/D/YY').utc() in duplicates_memo){
      duplicates.push(entry.time);
    }
    else {
      duplicates_memo[moment(entry.time,'M/D/YY').utc()] = entry.weight;
      db_entry.save(function(err){
        if (err) return console.log(err);
        console.log("Saving entry...");        
      });
    }
    
  }
  if (duplicates.length)
    console.log("Found dusplicate dates:");
    console.log(duplicates);
  return
}

//fs.writeFile( "records.json", JSON.stringify( proccessRawData(weightData) ), "utf8");
// Manually got rid of \n and white spaces
var records = JSON.parse(fs.readFileSync('records.json'));
//uploadData(records);
