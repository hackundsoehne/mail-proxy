var express = require('express');
var bodyParser = require('body-parser');
var request = require('superagent');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var mailchimpInstance = 'us16';
var listUniqueId = 'ca6e90c2fb';
var mailchimpApiKey = 'dbb937616a11d39ab5a22a966569b7a2-us16';

app.post('/mailsignup', function (req, res) {
  request
    .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
    .send({
      'email_address': req.body.EMAIL,
      'status': 'subscribed',
      'merge_fields': {
        'FNAME': req.body.FNAME,
        'LNAME': req.body.LNAME
      }
    })
    .end(function(err, response) {
      if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
        res.send('success');
      } else {
        res.send('error');
      }
    });
});

app.listen(4567, function () {
  console.log('Server listening on port 4567.');
});
