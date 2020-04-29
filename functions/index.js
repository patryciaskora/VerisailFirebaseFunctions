const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors =  require('cors');
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

const app = express();
app.use(cors({origin:true}));
admin.initializeApp();

exports.inspectionDetailsRealtime = functions.database.ref('/event_inspections_details/')
    .onCreate((snapshot, context) => {
      var url = "http://ec2-3-89-226-21.compute-1.amazonaws.com:3000/newinspdetail";
      var inspectionDetails = snapshot.val();
      // all events
      snapshot.forEach(function(eventIDSnapshot) {
        var eventID = eventIDSnapshot.key;
        // all dates
        eventIDSnapshot.forEach(function(dateIDSnapshot) {
          var date = dateIDSnapshot.key;
          // all boats
          dateIDSnapshot.forEach(function(boatIDSnapshot) {
            var boatID = boatIDSnapshot.key;
            var insp = {"eventID": eventID, "boatID": boatID};
            console.log("INSPECTION: " + JSON.stringify(insp)); 

            //all parts for each boat
            boatIDSnapshot.forEach(function(inspectionDetailsSnapshot) {
              var part = inspectionDetailsSnapshot.key;
              var partDetails = inspectionDetailsSnapshot.val();
              partDetails.eventID = eventID;

              var callBody = JSON.parse(JSON.stringify(partDetails));
              var callBodyStr = JSON.stringify(partDetails);
              console.log(partDetails);
              xhr.open("POST", url, true);
              xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
              xhr.send(callBodyStr);
            })
          })
        })
      })
    });

    exports.quickScan= functions.https.onCall((data, context) => {
      const text = data.qrcodetext;
      return admin.database().ref('qrcodes/' + text).once('value').then(function(snapshot) {
        var scannedDetails = JSON.stringify(snapshot.val());
        console.log(scannedDetails);
        return{scannedDetails};
      })
    });