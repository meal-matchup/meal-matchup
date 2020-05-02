'use strict';

const functions = require('firebase-functions');
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();

const bucket = functions.config().gcp.bucket;

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

exports.scheduledFirestoreExport = functions.pubsub
	.schedule('every 24 hours')
	.onRun((context) => {
		const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
		const databaseName = client.databaseName(projectId, '(default)');

		return client
			.exportDocuments({
				name: databaseName,
				outputUriPrefix: bucket,
				collectionIds: [],
			})
			.then((responses) => {
				const response = responses[0];
				console.log(`Operation name: ${response['name']}`);
				return response;
			})
			.catch((error) => {
				console.error(error);
				throw new Error("Export operation failed");
			});
	});

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
