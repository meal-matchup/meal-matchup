"use strict";

import admin = require("firebase-admin");
import firestore = require("@google-cloud/firestore");
import functions = require("firebase-functions");
import mailgun = require("mailgun-js");
import moment = require("moment");

const client = new firestore.v1.FirestoreAdminClient();

const serviceAccount = functions.config().sk;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://meal-matchup-development.firebaseio.com",
});

const MAILGUN_DOMAIN = "mg.mealmatchup.org";

const mg = mailgun({
	apiKey: functions.config().mailgun.key,
	domain: MAILGUN_DOMAIN,
});

const bucket = functions.config().gcp.bucket;

export const createKeyAndEmailUser = functions.pubsub
	.schedule("every 24 hours")
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
										case 5:
										case 1:
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
																	"D/M"
																)}`,
																text: `Howdy!

		You have an upcoming pickup request scheduled ${
			diff === 0 ? "today" : diff === 1 ? `in ${diff} day` : `in ${diff} days`
		}.

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
