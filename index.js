var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  id: String,
  name: String,
  time: Date,
  location: String,
  limit: Number,
  people: [String]
});
var Event = mongoose.model('Event', eventSchema);

mongoose.connect('mongodb://bwencke:Sally69@ds043002.mongolab.com:43002/heroku_app37457141');
var conn = mongoose.connection;
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index.html');
});

app.get('/add', function(request, response) {
  var e = new Event({
    name: 'Example Event',
    id: 'exampleEvent',
    time: new Date,
    location: 'Somewhere',
    limit: 50,
    people: ['bwencke', 'someone']
  });
  e.save(function(err) {
  if (err) throw err;

  console.log('Event saved successfully!');
});
  response.render('add.html');
});

app.post('/rsvp', function(req, res) {
  var userName = req.body.user_name;
  var eventId = req.body.text;

  try {
    var event = getEvent(eventId);
  } catch(e) {
    res.send("Sorry, we couldn't find an event with the id \"" + eventId + "\".");
    return;
  }

  var eventName = (event.name == null) ? "undefined" : event.name;
  addUser(event, userName);

  try {
    event.save(function(err) {
      if (err) throw err;

      console.log('Event saved successfully!');
    });
  } catch(e) {
    res.send("RSVP for the event \"" + eventName + "\" failed.");
    return;
  }

  res.send("Successfully RSVPed for \"" + eventName + "\"!");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function getEvent(eventId) {
  Event.find({ id: eventId }, function(err, event) {
    if (err) throw err;

    // object of the event
    console.log(event);
  });
}

function addUser(event, userName) {
  event.people.push(userName);
}

module.exports = Event;
