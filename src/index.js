// 3rd party imports
const express = require('express');
const bodyParser = require('body-parser');
const request = require('superagent');

// Handle Environment Variables
const MAILCHIMP_INSTANCE = process.env.MAILCHIMP_INSTANCE;
const LIST_UNIQUE_ID = process.env.LIST_UNIQUE_ID;
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;

if (typeof MAILCHIMP_INSTANCE == 'undefined' || !MAILCHIMP_INSTANCE) {
    console.error("MAILCHIMP_INSTANCE environment variable is undefined");
    process.exit(1);
}
if (typeof LIST_UNIQUE_ID == 'undefined' || !LIST_UNIQUE_ID) {
    console.error("LIST_UNIQUE_ID environment variable is undefined");
    process.exit(1);
}
if (typeof MAILCHIMP_API_KEY == 'undefined' || !MAILCHIMP_API_KEY) {
    console.error("MAILCHIMP_API_KEY environment variable is undefined");
    process.exit(1);
}


// Create HTTP Server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Add global error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end();
});

// Add headers to response
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Add global logging middleware
app.use(logRequest);

function logRequest(req, res, next) {
    console.log(`${new Date()} ${getIp(req)} ${req.method} ${req.url}`);
    next();
};

function getIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

// Health Check Endpoint
app.get('/health', (req, res) => res.status(200).end());

// Handle the mailsignup API call
app.post('/mailsignup', function (req, res) {
    request
        .post('https://' + MAILCHIMP_INSTANCE + '.api.mailchimp.com/3.0/lists/' + LIST_UNIQUE_ID)
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + Buffer.from('any:' + MAILCHIMP_API_KEY).toString('base64'))
        .send({
            'members': [{
                'email_address': req.body.EMAIL,
                'status_if_new': 'subscribed',
                'merge_fields': {
                    'FNAME': req.body.FNAME,
                    'LNAME': req.body.LNAME
                },
                'interests': req.body.INTERESTS
            }],
            'update_existing': true
        })
        .end(function (err, response) {
            res.status(response.status).send(response.body);
        });
});

app.listen(4567, function () {
    console.log('Server listening on port 4567.');
});
