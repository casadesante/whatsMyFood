"use strict";

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.http = (request, response) => {
  console.log("====================================");
  console.log("Printing request");
  console.log("====================================");
  response.status(200).send("Hello World!");
};

exports.event = (event, callback) => {
  callback();
};
