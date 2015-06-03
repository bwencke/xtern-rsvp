var express = require('express');
var bodyParser = require('body-parser')
var app = express();

// create application/json parser
var jsonParser = bodyParser.json()

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.post('/rsvp', jsonParser, function(req, res) {
  console.log(req);
  res.send(req.body.user_name)
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
