"use strict";

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const firestore = require("@google-cloud/firestore");
const moment = require("moment");
const client = new firestore.v1.FirestoreAdminClient();

const serviceAccount = require("./sk.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://meal-matchup-development.firebaseio.com",
});

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
	.schedule("every 24 hours")
	.onRun(context => {
		const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
		const databaseName = client.databasePath(projectId, "(default)");

		return client
			.exportDocuments({
				name: databaseName,
				outputUriPrefix: bucket,
				collectionIds: [],
			})
			.then(responses => {
				const response = responses[0];
				console.log(`Operation name: ${response["name"]}`);
				return response;
			})
			.catch(error => {
				console.error(error);
				throw new Error("Export operation failed");
			});
	});

exports.keyLogMade = functions.firestore
	.document("keys/{keyId}")
	.onUpdate((change, context) => {
		if (
			change.after.data().complete &&
			change.after.data().items &&
			change.after.data().donatorSignature &&
			change.after.data().receiverSignature &&
			change.after.data().occurrenceId &&
			change.after.data().requestId &&
			change.after.data().date
		) {
			const batch = admin.firestore().batch();

			const logRef = admin.firestore().collection("logs").doc();
			batch.set(logRef, {
				date: change.after.data().date,
				items: change.after.data().items,
				occurrenceId: change.after.data().occurrenceId,
				requestId: change.after.data().requestId,
				donatorSignature: change.after.data().donatorSignature,
				receiverSignature: change.after.data().receiverSignature,
			});

			const occurrenceDate = moment(change.after.data().date.toDate()).format(
				"YYYY MMMM D"
			);

			const requestRef = admin
				.firestore()
				.collection("requests")
				.doc(change.after.data().requestId);
			batch.update(requestRef, {
				completedDates: admin.firestore.FieldValue.arrayUnion(occurrenceDate),
			});

			const occurrenceRef = requestRef
				.collection("occurrences")
				.doc(change.after.data().occurrenceId);
			batch.update(occurrenceRef, {
				complete: true,
				logId: logRef.id,
			});

			return batch.commit();
		} else {
			return "invalid data";
		}
	});

exports.userUpdated = functions.firestore
	.document("users/{uid}")
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
