"use strict";

const admin = require("firebase-admin");
const functions = require("firebase-functions");
const firestore = require("@google-cloud/firestore");
const moment = require("moment");
const mailgun = require("mailgun-js");
const client = new firestore.v1.FirestoreAdminClient();

const serviceAccount = require("./sk.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://meal-matchup-development.firebaseio.com",
});

const MAILGUN_DOMAIN = "mg.mealmatchup.org";

const mg = mailgun({
	apiKey: functions.config().mailgun.key,
	domain: MAILGUN_DOMAIN,
});

const today = new Date();
today.setHours(0, 0, 0, 0);
const mToday = moment(today);

admin
	.firestore()
	.collection("requests")
	.where("dates.to", ">=", today)
	.get()
	.then(snapshot => {
		snapshot.docs.forEach(doc => {
			doc.ref
				.collection("occurrences")
				.where("date", ">=", today)
				.get()
				.then(ocSnapshot => {
					ocSnapshot.docs.forEach(ocDoc => {
						if (ocDoc && !ocDoc.data().complete) {
							const ocDate = ocDoc.data().date.toDate();
							ocDate.setHours(0, 0, 0, 0);
							const mOcDate = moment(ocDate);
							const diff = mOcDate.diff(mToday, "days", true);

							if (diff === 6 || diff === 5 || diff === 1 || diff === 0) {
								// either 5, 1, or 0 days out

								const donatorRef = admin
									.firestore()
									.collection("agencies")
									.doc(doc.data().donator);
								const receiverRef = admin
									.firestore()
									.collection("agencies")
									.doc(doc.data().receiver);

								const batch = admin.firestore().batch();
								const newRef = admin.firestore().collection("keys").doc();

								const keyData = {
									complete: false,
									date: ocDate,
									donatorInfo: {},
									occurrenceId: ocDoc.id,
									password: newRef.id,
									receiverInfo: {},
									requestId: doc.id,
								};

								admin
									.firestore()
									.runTransaction(transaction => {
										return transaction.get(donatorRef).then(donatorDoc => {
											keyData.donatorInfo = {
												address: { ...donatorDoc.data().address },
												phone: donatorDoc.data().phone,
												contact: {
													name: donatorDoc.data().contact.name,
													email: donatorDoc.data().contact.email,
												},
												name: donatorDoc.data().name,
											};
											return transaction.get(receiverRef).then(receiverDoc => {
												if (receiverDoc.data()) {
													keyData.receiverInfo = {
														address: { ...receiverDoc.data().address },
														phone: receiverDoc.data().phone,
														contact: {
															name: receiverDoc.data().contact.name,
															email: receiverDoc.data().contact.email,
														},
														name: receiverDoc.data().name,
													};
												}
											});
										});
									})
									.then(() => {
										batch.commit().then(() => {
											const mailData = {
												from: "Meal Matchup <no-reply@mealmatchup.org>",
												to: doc
													.data()
													.deliverers.map(deliverer => deliverer.email)
													.join(", "),
												subject: "Upcoming Pickup Request",
												text: `Howdy!

You have an upcoming pickup request scheduled ${
													diff === 0
														? "today"
														: diff === 1
														? `in ${diff} day`
														: `in ${diff} days`
												}.

When you're ready to start this pickup, click this link for instructions on where to go, how to complete the food log, and where to drop off the donation.

https://www.mealmatchup.org/app/entry?key=${newRef.id}

Thank you, and stay safe.

Meal Matchup

			`,
											};

											mg.messages().send(mailData);

											console.log(mailData);
										});
									});
							}
						}
					});
				})
				.catch(error => {
					console.error(error);
				});
		});
	})
	.catch(error => {
		console.error(error);
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

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysBetween(date1, date2) {
	const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
	const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

exports.createKeyAndEmailUser = functions.pubsub
	.schedule('every 24 hours')
	.onRun((context) => {
		const today = new Date();
		db.collection('requests')
			.get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					if (doc.data().dates.to.toDate <= today) {
						doc.data().occurrences.forEach((occurrence, index) => {
							const keyData = {
								requestId: doc.id,
								occurrence: index,
							};

							switch (daysBetween(today, occurrence.date.toDate())) {
								case 1:
								case 7:
									// Request is either 1 or 7 days away
									// send email
									console.log("create key and send email", keyData);
							}
						});
					}
				});
			});
	});

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

exports.emailDeliverers = functions.pubsub
	.schedule("every 24 hours")
	.onRun(() => {
		console.log("mailgun api key", functions.config().mailgun.key);
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
