# Mail Proxy for Hack & Söhne 

Takes a POST request and sends another POST on to the Mailchimp API to subscribe them to a mailing list

## Environment Variables
* MAILCHIMP_INSTANCE - The API instance assigned to your account e.g. "us17"
* LIST_UNIQUE_ID - The ID of your mailing list
* MAILCHIMP_API_KEY - The API of your Mailchimp account

## Expected API call
```
{"EMAIL": "email@mydomain.com", "FNAME": "First Name", "LNAME": "Last Name", "INTERESTS": {"hash1": true, "hash2": false}}
```

## Running the app
Run ```npm install``` and ```npm start```.
