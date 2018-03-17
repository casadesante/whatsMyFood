'use strict';

var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccount.json');

// Initialzing the firebase with the appropriate service Account.  
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Validating the firebase ID token attached with each request.
const validateFirebaseIdToken = (request) =>
new Promise((resolve, reject) => {
  console.log('====================================');
  console.log('Headers:' +  JSON.stringify(request.headers));
  console.log('====================================');

  let idToken;
  if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization"  header');
    // Read the ID Token from the Authorization header.
    idToken = request.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.');
    reject("unAuthorized");
  }

  admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
    console.log('ID Token correctly decoded', decodedIdToken);
    resolve(idToken);
  }).catch((error) => {
    console.error('Error while verifying Firebase ID token:', error);
    reject("unAuthorized");
  });
});


exports.http = (request, response) => {
  validateFirebaseIdToken(request)
  .then((token) => {
    console.log('====================================');
    console.log('token: ' + token);
    console.log('====================================');
    response.set('Access-Control-Allow-Origin', '*');
    response.status(200).send(token);  
  })
  .catch((error) => {
    console.error('In Main Catch - error: ' + error);
    response.set('Access-Control-Allow-Origin', '*');
    if (error === "unAuthorized") {
      response.status(403).send(error);
    } else {
      response.status(500).send(error);
    }
  });
};
