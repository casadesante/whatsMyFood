// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Get a database reference to whatsMyFood
var db = admin.database();

exports.addUser = functions.https.onRequest((req, res) => {
  console.log('====================================');
  console.log("Received Request");
  console.log(req.body);
  console.log('====================================');
  
  let parsedRequest = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
  var firebaseID = parsedRequest.firebaseID;
  var readRef = db.ref("/users/" + firebaseID)
  var user = {};

  readRef.once("value")
    .then((snapshot, readError) => {
      if (readError) {
        throw readError;
      }
      console.log('====================================');
      console.log("snapshot value");
      console.log(snapshot.val());      
      console.log('====================================');
      return snapshot.val() !== null;
    })
    .then((exists) => {
      if (!exists) {
        user[firebaseID] = {
          "userName": parsedRequest.userName,
          "emailID": parsedRequest.emailID,
          "profilePictureURL": parsedRequest.profilePicURL,
          "restaurants": [],
          "createdAt": admin.database.ServerValue.TIMESTAMP
        };
        console.log('====================================');
        console.log("printing user");
        console.log(user);
        console.log('====================================');    
        let usersRef = db.ref("/users");
        return usersRef.update(user);  
      }
      return res.status(200).send("User Already exists");
    })
    .then((err) => {
      if (err) {
        throw err;
      } else {
        return res.status(200).send(user);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(err);
    });
});

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/users/{pushId}/name')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      console.log('====================================');
      console.log("snapshot");
      console.log(snapshot);
      console.log('====================================');
      console.log('====================================');
      console.log("context");
      console.log(context);
      console.log('====================================');
      const original = snapshot.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });
