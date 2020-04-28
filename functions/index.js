'use strict';

const functions = require('firebase-functions');
// const client = require('twilio')(
// 	functions.config().twilio.sid,
// 	functions.config().twilio.token
// );

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.userUpdated = functions.firestore
	.document('users/{uid}')
	.onUpdate((change, context) => {
		// if (change.after.data().smsNotifications === true) {
		// 	// Turned on SMS nnotifications
		// 	client.messages
		// 		.create({
		// 			body: 'This is a test',
		// 			from: functions.config().twilio.from,
		// 			to: '+13604201514',
		// 		})
		// 		.then((message) => console.log(message.sid));
		// }

		// Whenever a user is updated, see what changed and act accordingly

		switch (change.after.data().emailNotifications) {
			case true:
				// Send a thanks for tuning on
				break;
			case false:
				// Send a "this is the last email until you turn back on"
				break;
		}
	});
