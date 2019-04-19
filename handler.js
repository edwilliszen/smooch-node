'use strict';

console.log("Cold Start...");

const WA_message_template = {
  // update below with your namespace/template/variables/fallback
  "fallbackText": "HSM Sent: Test message from Smooch",
  "WABA_namespace": "whatsapp:hsm:communications:smoochio",
  "template_name": "test_localized",
  // Template text: "Hi {{1}}, your {{2}} reservation is confirmed!"
  "variables": [
      "{appUserName}",
      // for this sample, appUserName remains as a variable for later substitution, once the userName is known
      "Casa Geranio"
  ]
};

const notify_endpoint = "https://api.smooch.io/v1/apps/" + process.env.SMOOCH_APPID + "/notifications"; 

const notify_header = {
        'content-type': 'application/json',
        'authorization': 'Bearer ' + process.env.SMOOCH_JWT
};

const fallback = WA_message_template['fallbackText'];
const namespace = WA_message_template['WABA_namespace'];
const template = WA_message_template['template_name'];
const vars = WA_message_template["variables"];
const msg_text = `&[${fallback}](${namespace}, ${template},${vars})`;
const notify_data = {
  "storage": "full",
  "destination": {
      "integrationId": process.env.SMOOCH_INTEGRATIONID, // i.e., WhatsApp Integration
      "destinationId": "{targetPhone}" // User- and Channel-specific id (externalId); set later
  },
  // Standard Smooch-message structure
  "message": {
      "role": "appMaker",
      "type": "text",
      "text": msg_text
  }
}

function fail_unauthorised()
{
    const response=
    {
        "statusCode": 403,
        'body': "Unauthorised"
    }
    return response;
}

module.exports.connectNotification = async (event) => {
  // log SSM parameters for now
  console.log ("SMOOCH_INTEGRATIONID: " + process.env.SMOOCH_INTEGRATIONID);
  console.log ("SMOOCH_JWT: " + process.env.SMOOCH_JWT);
  console.log ("SMOOCH_APPID: " + process.env.SMOOCH_APPID);

  const d = new Date().toISOString();
  console.log("connectNotification: Received event @ :" + d);  
  console.log("Headers: " + JSON.stringify(event.headers, null, 2));
  console.log("Body: " + JSON.stringify(event.body, null, 2));

  if ('CONNECT_AUTHHEADER' in process.env && 'CONNECT_AUTHKEY' in process.env)
  {
    if (event.headers[process.env.CONNECT_AUTHHEADER] != process.env.CONNECT_AUTHKEY)
      return fail_unauthorised();
  }

  var request_body = "";  
  if (event.body === Object(event.body)) {     
    request_body = event.body;  // can use as is, when body isn't encoded already like testing with a regular json payload
  } else {
    // Body is encoded already so parse - postman
    request_body = JSON.parse(event.body);
  }
  console.log("request_body:" + JSON.stringify(request_body, null, 2));

  var contactName = '';
  if (request_body.data && request_body.data.contactName)
    contactName = request_body.data.contactName;
  else   // instead of 'hello <name>', use 'hello there'
    contactName = 'there';

  // set destinationId = userPhone
  notify_data.destination.destinationId = request_body.data.target;
  // update userName as variable in HSM shorthand
  notify_data.message.text = notify_data.message.text.replace("{appUserName}", contactName);

  console.log("Request url: " + JSON.stringify(notify_endpoint, null, 2));
  console.log("Request header: " + JSON.stringify(notify_header, null, 2));
  console.log("Request data: " + JSON.stringify(notify_data, null, 2));

  return {
    statusCode: 200,
    body: {
      message: 'connectNotification called successfully!'//,
      //input: event
    },
  }; 
};
