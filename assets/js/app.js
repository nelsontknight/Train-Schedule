$(document).ready(function () {

    // Your web app's Firebase configuration
    var firebaseConfig = {
		apiKey: "AIzaSyBlszEC29Lbb2LIpedkAtKkdfMLBsbn6uE",
		authDomain: "train-scheduler-7270f.firebaseapp.com",
		databaseURL: "https://train-scheduler-7270f.firebaseio.com",
		projectId: "train-scheduler-7270f",
		storageBucket: "train-scheduler-7270f.appspot.com",
		messagingSenderId: "418553444411",
		appId: "1:418553444411:web:f1757b46b0f9672337441e",
		measurementId: "G-F1W5E17GTP"
	  };
	  // Initialize Firebase
	  firebase.initializeApp(firebaseConfig);
	  
    // Create a variable to reference the database.
    var database = firebase.database();

    // Capture Button Click
    $("#add-user").on("click", function (event) {
        event.preventDefault();

        // Grabbed values from text-boxes
        let trainName = $("#inputTrainName").val().trim();
        let destination = $("#inputDestination").val().trim();
        let firstTrainTime = $("#inputFirstTrainTime").val().trim();
        let frequency = $("#inputFrequency").val().trim();

        // Code for "Setting values in the database"
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
        });
    });

    database.ref().on("child_added", function (snapshot) {

        let sv = snapshot.val();


     
        let firstTime = moment(sv.firstTrainTime, "HH:mm").subtract(1, 'years');
        console.log("first time" + firstTime);
        let currentTime = moment();

        let tFrequency = sv.frequency;

        //Difference between current time and first time

        let diffTime = moment().diff(moment(firstTime), "minutes");
        console.log("Difference in Time: " + diffTime);

        //Time apart (remainder)
        let tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        //Minutes Until; Train 
        let tMinutesTillTrain = tFrequency - tRemainder;
        console.log("Minutes Until Train: " + tMinutesTillTrain);

        //Next Train
        let nextTrain = moment().add(tMinutesTillTrain, "minutes");
        let nextArrival = moment(nextTrain).format("h:mm a");
        console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));


         // Change the HTML to reflect the data in a new row.

        let dataArray = [sv.trainName, sv.destination, sv.frequency, nextArrival, tMinutesTillTrain];

        let newRow = $("<tr>");

        for (let i = 0; i < dataArray.length; i++) {

            let newTD = $('<td>');
            newTD.append(dataArray[i]);
            $(newRow).append(newTD);
        }

        $('tbody').append(newRow);

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });


});