var express = require('express');
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;
//mongoose.connect('mongodb://bwencke:Sally69@ds043002.mongolab.com:43002/heroku_app37457141');
//var conn = mongoose.connection;
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.post('/rsvp', function(req, res) {
  var userName = req.body.user_name;
  var eventId = req.body.text;
  var eventName = getEventName(eventId);
  var text;
  if(eventName == null) {
  	text = "Sorry, we couldn't find an event with the id \"" + eventId + "\".";
  } else {
  	//var user = { "user_name": userName };
  	//conn.collection(eventId).insert(user);
  	text = 'Successfully RSVPed for ' + eventName + '! ';
  }
  var botPayload = {
    text : text
  };

  // avoid infinite loop
  // if (userName !== 'slackbot') {
  //   return res.status(200).json(botPayload);
  // } else {
  //   return res.status(200).end();
  // }
  res.send(text);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function getEventName(eventId) {
	if(eventId == "party") {
		return "Party Time";
	} else {
		return null;
	}
}
