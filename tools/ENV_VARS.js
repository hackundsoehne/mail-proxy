var ENV_VARS;

var SERVER_URL_PROD = "${SERVER_URL}";

var CONSTANTS = {
  MAILCHIMP_INSTANCE: "${MAILCHIMP_INSTANCE}",
  LIST_UNIQUE_ID: "${LIST_UNIQUE_ID}",
  MAILCHIMP_API_KEY: "${MAILCHIMP_API_KEY}"
};

if (process.env.NODE_ENV !== "production" || !isProdUrl(SERVER_URL_PROD)) {
  console.log("Dev variables chosen - (this also happens when you're not in docker)");
  ENV_VARS = {
    SERVER_URL: "http://localhost:4567",
    CONSTANTS: CONSTANTS
  }
} else {
  console.log("Prod variables chosen");
  ENV_VARS = {
    SERVER_URL: SERVER_URL_PROD,
    CONSTANTS: CONSTANTS
  }
}

// Checks if docker replaced url correctly, otherwise jump back to dev
function isProdUrl(url) {
  return !url.startsWith('$')
}

module.exports  = ENV_VARS;
