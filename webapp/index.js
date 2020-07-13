var express = require('express')
var cors = require('cors')
var app = express()
app.use(cors())
var bodyParser = require('body-parser')
app.use(bodyParser.json());

const Meters = require('./lib/MeterController')
const Identity = require('./lib/identiy')
const importCard = require('./lib/importCard')
app.use(express.static('public'))


let Meter;
app.listen(5700, function () {
  Meter = new Meters();
  console.log('CORS-enabled web server listening on port 5700')
})



app.get('/', async function (req, res) {

  res.send("Welcome to Home page")
 
});


app.post('/api/issueIdentity', async function (req, res) {

  
  Identity(req.query.userid).then(function (data) {
    //res.json(data)
    res.send({
              userId : data.newUserId,
              outputfile: data.fileName,
              participantId :  data.participantId 
            
            } )
 
  }).catch(function (error) {
    res.status(409).send({ message: error.message })

  })
});

app.post('/api/importCard', async function (req, res) {

  
  importCard(req.body.userId, req.body.outputfile).then(function (data) {
 
    //res.send(`Successfully Issued identity and createed Network Card for ${data.newUserId} Output file: ${data.fileName}, for the Participant ${data.participantId}`)
  }).catch(function (error) {
    res.status(409).send({ message: error.message })

  })
});



app.get('/api/updateMeters', async function (req, res) {
  await Meter.init();
  let results = await Meter.updateMeters();
  res.send(results);
  return results;
});

app.get('/api/history', async function (req, res) {
  await Meter.init();
  let results = await Meter.getHistory();
  res.send(results)
  return results
})




function isValidDate(dateString) {

  console.log(dateString)
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}



app.post('/api/sendEmails', async function (req, res) {


  var regex = /[xyz]/;
  let date = isValidDate(req.query.start)

  if (date == false) {
    res.statusCode = 400;
    res.send("Please enter a valid date with the following format yyyy-mm-dd")
    return;
  }

  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  let formatted = new Date(currentDate.getTime() + Math.abs(currentDate.getTimezoneOffset() * 60000))
  let querydate = new Date(req.query.start)
  if ((querydate.getTime() > formatted.getTime())) {
    res.statusCode = 400;
    res.send("Please select a date before today's date")
    return;
  }

  await Meter.init();

  try {
    let results = await Meter.sendEmails(req.query.start)
    res.send(`Successfully sent daily metering consumptions to the following Customers ${results}`)


  } catch (error) {
    res.status(401).send(error)
    // res.send(error)
    //res.status(401).send("Authentication failed, please try again with correct id and password")


  }





})


module.exports = app;


