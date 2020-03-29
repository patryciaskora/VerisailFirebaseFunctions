const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
 console.log('Hi to console');
 response.send("Hello from Firebase!");
});

exports.readInspectionsDetails = functions.https.onRequest((request, response) => {
    var allInspectionDetails = admin.database().ref("event_inspections");
    allInspectionDetails.on("value", gotData, gotErr); 

    function gotData(snapshot) {
      var inspectionDetails = snapshot.val();
      var numEvents = snapshot.numChildren();
      var eventIDS = Object.keys(inspectionDetails)

      // all events
      snapshot.forEach(function(eventIDSnapshot) {
        var eventID = eventIDSnapshot.key;
        var eventIDData = eventIDSnapshot.val();

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
              partDetails.date = date;

              console.log("inspection detail: " +  JSON.stringify(partDetails));

              response.send(JSON.stringify(partDetails));
            })
          })
        })
      })
    }
    function gotErr(snapshot){
      console.log("Got error");
    }
});

exports.readInspection = functions.https.onRequest((request, response) => {
  var allInspections = admin.database().ref("event_registrations");
  allInspections.on("value", gotData, gotErr);

  function gotData(snapshot) {
    var inspections = snapshot.val();
    var numEvents = snapshot.numChildren();
    var eventIDS = Object.keys(inspections)

    snapshot.forEach(function(eventIDSnapshot) {
      var eventID = eventIDSnapshot.key;
      var eventIDData = eventIDSnapshot.val();

      eventIDSnapshot.forEach(function(boatIDSnapshot) {
        var boatID = boatIDSnapshot.key;
        var boatIDData = boatIDSnapshot.val();

        boatIDData.eventID = eventID;
        boatIDData.boatID = boatID;

        console.log("boat id data" + JSON.stringify(boatIDData));

        var dataBody = JSON.stringify(boatIDData);

        response.send(dataBody);
      })
    })
  }
  function gotErr(snapshot){
    console.log("Got an error");
  }
});