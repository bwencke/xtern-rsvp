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
  response.render('add.html');
});

app.post('/rsvp', function(req, res) {
  var userName = req.body.user_name;
  var eventId = req.body.text;
  var text = "hello";

  Event.findOne({ id: eventId }, function(err, event) {
    if (err || !event) {
      text = "Sorry, we couldn't find an event with the id \"" + eventId + "\".";
      res.send(text);
    } else {
      // object of the event
      console.log(event);

      var eventName = (!event.name) ? "undefined" : event.name;
      var addRet = addUser(event, userName);
      if(!addRet) {
        text = "You've already RSVPed for \"" + eventName + "!\"";
        res.send(text);
      } else if(addRet == 2) {
        text = "Sorry, \"" + eventName + "\" is already full!";
        res.send(text);
      } else {
        event.save(function(err) {
          if (err) {
            text = "RSVP for the event \"" + eventName + "\" failed.";
            res.send(text);
          } else {
            console.log('Event saved successfully!');
            text = "Successfully RSVPed for \"" + eventName + "\"!";
            res.send(text);
          }
        });
      }
    }

  });
});

app.post('/add', function(req, res) {
  var name = req.body.name;
  var id = req.body.tag;
  var limit = req.body.limit || 1000;

  var e = new Event({
    name: name,
    id: id,
    time: new Date,
    location: 'Somewhere',
    limit: limit,
    people: []
  });
  e.save(function(err) {
  if (err) throw err;

  console.log('Event saved successfully!');
  res.send("Event successfully created! RSVP using /rsvp " + id)
  });
});

app.post('/event', function(req, res) {
  var eventId = req.body.text;

  Event.findOne({ id: eventId }, function(err, event) {
    if (err || !event) {
      text = "Sorry, we couldn't find an event with the id \"" + eventId + "\".";
      res.send(text);
    } else {
      // object of the event
      console.log(event);

      var text = "No one has RSVPed for this event. Better luck next time.";
      if(event.people && event.people.length > 0) {
        text = event.people.length + " awesome peeps have RSVPed for " + event.name + "\n";
        event.people.forEach(function(person) {
          text += person + "\n"
        });
      }
      res.send(text);
    }

  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function addUser(event, userName) {
  var ret = 1;
  if(!event.people) {
    event.people = [];
  }
  if(event.people.length == event.limit) {
    ret = 2;
  }
  event.people.forEach(function(person) {
    if(person == userName) {
      ret = 0;
    }
  });
  event.people.push(userName);
  return ret;
}

module.exports = Event;
