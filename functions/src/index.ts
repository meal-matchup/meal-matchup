"use strict";

import admin = require("firebase-admin");
import Debug = require("debug");
import firestore = require("@google-cloud/firestore");
import functions = require("firebase-functions");
import mailgun = require("mailgun-js");
import moment = require("moment");
import uniqid = require("uniqid");

const debug = Debug("func");

const client = new firestore.v1.FirestoreAdminClient();

/**
 * Grabs the service account from our env variables. For a tutorial on how to do this,
 * see our {@link https://github.com/meal-matchup/meal-matchup/wiki/Working-on-Firebase-Functions | GitHub wiki}.
 */
const serviceAccount = functions.config().sk;

/** Initialize the app using the service account in our env variables */
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://meal-matchup-development.firebaseio.com",
});

// The domain we use for mailgun
const MAILGUN_DOMAIN = "mg.mealmatchup.org";

/** Initialize Mailgun using our API key and domain */
const mg = mailgun({
	apiKey: functions.config().mailgun.key,
	domain: MAILGUN_DOMAIN,
});

// Our Google Cloud storage bucket
const bucket = functions.config().gcp.bucket;

/**
 * Ever 24 hours, check upcoming requests. If they occur today, tomorrow,
 * or in 5 days, we send an email to all parties reminding them.
 *
 * @TODO Include donators and receivers in this.
 */
export const createKeyAndEmailUser = functions.pubsub
	.schedule("5 11 * * *")
	.timeZone("America/Los_Angeles")
	.onRun(() => {
		const today = new Date();
		const mToday = moment.utc(today);

		const yesterday = new Date(today.valueOf());
		yesterday.setDate(yesterday.getDate() - 1);

		admin
			.firestore()
			.collection("requests")
			.where("dates.to", ">=", yesterday)
			.get()
			.then(snapshot => {
				console.log("today", today);
				snapshot.docs.forEach(doc => {
					doc.ref
						.collection("occurrences")
						.where("date", ">=", yesterday)
						.get()
						.then(ocSnapshot => {
							ocSnapshot.docs.forEach(ocDoc => {
								if (ocDoc && !ocDoc.data().complete) {
									const ocDate = ocDoc.data().date.toDate();
									console.log(today, ocDate);
									const mOcDate = moment.utc(ocDate);
									const diff = Math.round(mOcDate.diff(mToday, "days", true));

									switch (diff) {
										case 2:
										case 0: {
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
													return transaction
														.get(donatorRef)
														.then(donatorDoc => {
															keyData.donatorInfo = {
																address: { ...donatorDoc.data()?.address },
																phone: donatorDoc.data()?.phone,
																contact: {
																	name: donatorDoc.data()?.contact.name,
																	email: donatorDoc.data()?.contact.email,
																},
																name: donatorDoc.data()?.name,
															};

															const donatorMailData = {
																from: "Meal Matchup <no-reply@mealmatchup.org>",
																to: donatorDoc.data()?.contact.email,
																subject: `Upcoming Request on ${mOcDate.format(
																	"M/D"
																)}`,
																text: `Howdy!

This is just a reminder that you have an upcoming request scheduled ${
																	diff === 0 ? "for today" : `in ${diff} days`
																}, on ${mOcDate.format("M/D")}.

You can check on the status of this request by logging in at https://www.mealmatchup.org/app.

Thank you, and stay safe.

Meal Matchup`,
															};

															mg.messages()
																.send(donatorMailData)
																.catch(error => console.error(error));

															return transaction
																.get(receiverRef)
																.then(receiverDoc => {
																	keyData.receiverInfo = {
																		address: { ...receiverDoc.data()?.address },
																		phone: receiverDoc.data()?.phone,
																		contact: {
																			name: receiverDoc.data()?.contact.name,
																			email: receiverDoc.data()?.contact.email,
																		},
																		name: receiverDoc.data()?.name,
																	};

																	const receiverMailData = {
																		from:
																			"Meal Matchup <no-reply@mealmatchup.org>",
																		to: receiverDoc.data()?.contact.email,
																		subject: `Upcoming Request on ${mOcDate.format(
																			"M/D"
																		)}`,
																		text: `Howdy!

This is just a reminder that you have an upcoming request scheduled ${
																			diff === 0
																				? "for today"
																				: `in ${diff} days`
																		}, on ${mOcDate.format("M/D")}.

You can check on the status of this request by logging in at https://www.mealmatchup.org/app.

Thank you, and stay safe.

Meal Matchup`,
																	};

																	mg.messages()
																		.send(receiverMailData)
																		.catch(error => console.error(error));
																});
														});
												})
												.then(() => {
													batch
														.commit()
														.then(() => {
															const mailData = {
																from: "Meal Matchup <no-reply@mealmatchup.org>",
																to: doc
																	.data()
																	.deliverers.map(
																		(deliverer: { email?: string }) =>
																			deliverer.email
																	)
																	.join(", "),
																subject: `Upcoming Request on ${mOcDate.format(
																	"M/D"
																)}`,
																text: `Howdy!

You have an upcoming pickup request scheduled ${
																	diff === 0 ? "today" : `in ${diff} days`
																}, on ${mOcDate.format("M/D")}.

When you're ready to start this pickup, click this link for instructions on where to go, how to complete the food log, and where to drop off the donation.

https://www.mealmatchup.org/app/entry?key=${newRef.id}

Thank you, and stay safe.

Meal Matchup`,
															};

															mg.messages()
																.send(mailData)
																.catch(error => console.error(error));
														})
														.catch(error => console.error(error));
												})
												.catch(error => console.error(error));

											break;
										}
									}
								}
							});
						})
						.catch(error => console.error(error));
				});
			})
			.catch(error => console.error(error));
	});

/**
 * Every 24 hours, take a backup of our firestore database
 */
export const scheduledFirestoreExport = functions.pubsub
	.schedule("every 24 hours")
	.onRun(() => {
		const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
		const databaseName = client.databasePath(projectId, "(default)");

		return client
			.exportDocuments({
				name: databaseName,
				outputUriPrefix: bucket,
				collectionIds: [],
			})
			.then((responses: { name: string }[]) => {
				const response = responses[0];
				console.log(`Operation name: ${response["name"]}`);
				return response;
			})
			.catch((error: unknown) => {
				console.error(error);
				throw new Error("Export operation failed");
			});
	});

/**
 *
 */
export const newRequestCreated = functions.firestore
	.document("requests/{requestId}")
	.onCreate(newDoc => {
		if (newDoc.data().deliverer === "ANY") {
			admin
				.firestore()
				.collection("agencies")
				.where("umbrella", "==", newDoc.data().umbrella)
				.where("type", "==", "DELIVERER")
				.get()
				.then(snapshot => {
					const uids: { uid: string }[] = [];

					snapshot.docs.forEach(doc => {
						Object.keys(doc.data().admins).forEach(uid => uids.push({ uid }));
					});

					return admin.auth().getUsers(uids);
				})
				.then(getUsersResult => {
					const addresses: string[] = [];

					getUsersResult.users.forEach(userRecord => {
						if (userRecord.email) addresses.push(userRecord.email);
					});

					if (addresses.length > 0) {
						const recipientVariables: {
							[email: string]: { uid: string };
						} = {};

						addresses.forEach(
							address => (recipientVariables[address] = { uid: uniqid() })
						);

						mg.messages()
							.send({
								from: "Meal Matchup <no-reply@mealmatchup.org>",
								to: addresses.join(", "),
								subject: "New Meal Matchup Request Available!",
								text: `Howdy deliverer!

There's a new ${`${
									newDoc.data().type
								}`.toLocaleLowerCase()} request scheduled from ${moment(
									newDoc.data().dates.from.getDate()
								).format("M/D/YYYY")} to ${moment(
									newDoc.data().dates.to.getDate()
								).format("M/D/YYYY")} between ${moment(
									newDoc.data().time.start.getDate()
								).format("h:mm a")} and ${moment(
									newDoc.data().time.to.getDate()
								).format("h:mm a")}.

If you are able and willing, please log in to Meal Matchup and claim this request!

Thanks, and stay safe!
Meal Matchup
`,
								"recipient-variables": JSON.stringify({}),
							})
							.catch(error => console.error(error));
					}
				})
				.catch(e => {
					debug(e);
					console.error(e);
				});
		}

		if (newDoc.data().receiver === "ANY") {
			admin
				.firestore()
				.collection("agencies")
				.where("umbrella", "==", newDoc.data().umbrella)
				.where("type", "==", "RECEIVER")
				.get()
				.then(snapshot => {
					const uids: { uid: string }[] = [];

					snapshot.docs.forEach(doc => {
						Object.keys(doc.data().admins).forEach(uid => uids.push({ uid }));
					});

					return admin.auth().getUsers(uids);
				})
				.then(getUsersResult => {
					const addresses: string[] = [];

					getUsersResult.users.forEach(userRecord => {
						if (userRecord.email) addresses.push(userRecord.email);
					});

					if (addresses.length > 0) {
						const recipientVariables: {
							[email: string]: { uid: string };
						} = {};

						addresses.forEach(
							address => (recipientVariables[address] = { uid: uniqid() })
						);

						mg.messages()
							.send({
								from: "Meal Matchup <no-reply@mealmatchup.org>",
								to: addresses.join(", "),
								subject: "New Meal Matchup Request Available!",
								text: `Howdy receiver!

There's a new ${`${
									newDoc.data().type
								}`.toLocaleLowerCase()} request scheduled from ${moment(
									newDoc.data().dates.from.getDate()
								).format("M/D/YYYY")} to ${moment(
									newDoc.data().dates.to.getDate()
								).format("M/D/YYYY")} between ${moment(
									newDoc.data().time.start.getDate()
								).format("h:mm a")} and ${moment(
									newDoc.data().time.to.getDate()
								).format("h:mm a")}.

If you are able and willing, please log in to Meal Matchup and claim this request!

Thanks, and stay safe!
Meal Matchup
`,
								"recipient-variables": JSON.stringify({}),
							})
							.catch(error => console.error(error));
					}
				})
				.catch(e => {
					debug(e);
					console.error(e);
				});
		}
	});

/**
 * When an entry is made from a one-off link, create an actual log
 * in the database and reference it in the request and occurrence
 */
export const keyLogMade = functions.firestore
	.document("keys/{keyId}")
	.onUpdate(change => {
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
