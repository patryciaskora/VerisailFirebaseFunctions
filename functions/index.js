const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
 console.log('Hi to console');
 response.send("Hello from Firebase!");
});

exports.readInspections = functions.https.onRequest((request, response) => {
    var allInspections = admin.database().ref("event_inspections");
    allInspections.on("value", gotData, gotErr); 

    function gotData(snapshot) {
      var inspections = snapshot.val();
      var numEvents = snapshot.numChildren();
      var eventIDS = Object.keys(inspections)

      // all events
      snapshot.forEach(function(eventIDSnapshot) {
        var eventID = eventIDSnapshot.key;
        var eventIDData = eventIDSnapshot.val();

        // all dates
        eventIDSnapshot.forEach(function(dateIDSnapshot) {
          var date = dateIDSnapshot.key;
          var dateData = dateIDSnapshot.val();
          // all boats
          dateIDSnapshot.forEach(function(boatIDSnapshot) {
            var boatID = boatIDSnapshot.key;
            var boatIDData = boatIDSnapshot.val();

            var insp = {"eventID": eventID, "boatID": boatID};
            console.log("INSPECTION: " + JSON.stringify(insp)); 
            boatIDSnapshot.forEach(function(inspectionDetailsSnapshot) {
              console.log(inspectionDetailsSnapshot.val());
            })
          })
        })
      })
    }

    function gotErr(snapshot){
      console.log("Got error");
    }
});