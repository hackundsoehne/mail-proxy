var express = require('express');
var bodyParser = require('body-parser');
var request = require('superagent');
var ENV_VARS = require('../tools/ENV_VARS');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/mailsignup', function (req, res) {
  request
    .post('https://' + ENV_VARS.CONSTANTS.MAILCHIMP_INSTANCE + '.api.mailchimp.com/3.0/lists/' + ENV_VARS.CONSTANTS.LIST_UNIQUE_ID + '/members/')
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('Authorization', 'Basic ' + new Buffer('any:' + ENV_VARS.CONSTANTS.MAILCHIMP_API_KEY).toString('base64'))
    .send({
      'email_address': req.body.EMAIL,
      'status_if_new': 'subscribed',
      'merge_fields': {
        'FNAME': req.body.FNAME,
      },
      'interests': req.body.INTERESTS,
      'update_existing': true
    })
    .end(function(err, response) {
      if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
        res.send('success');
      } else {
        res.send('error');
        console.log(response.body)
      }
    });
});

app.listen(8080, function () {
  console.log('Server listening on port 8080.');
});
