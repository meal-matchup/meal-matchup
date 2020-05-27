import { AgencyTypes, RequestTypes } from "../../../utils/enums";
import { Button, Descriptions, Form, Popconfirm } from "antd";
import { formGoogleMapsUrl, isSameDate } from "../../../utils/functions";
import AppContext from "../AppContext";
import ClaimRequestDrawer from "./ClaimRequestDrawer";
import { Drawer } from "../";
import FoodLogDrawer from "./FoodLogDrawer";
import React from "react";
import firebase from "gatsby-plugin-firebase";
import moment from "moment";

interface ExistingRequestDrawerProps {
	open?: boolean;
	request?: string;
	date?: moment.Moment;
	agencies?: firebase.firestore.QuerySnapshot;
	agency?: firebase.firestore.DocumentSnapshot;
	onClose?: () => void;
}

interface ExistingRequestDrawerState {
	claiming: boolean;
	editingFoodLog: boolean;
}

class ExistingRequestDrawer extends React.Component<
	ExistingRequestDrawerProps,
	ExistingRequestDrawerState
> {
	constructor(props: ExistingRequestDrawerProps) {
		super(props);

		this.onClose = this.onClose.bind(this);
		this.claimRequest = this.claimRequest.bind(this);
		this.closeClaimRequestDrawer = this.closeClaimRequestDrawer.bind(this);
		this.deleteRequest = this.deleteRequest.bind(this);
		this.toggleFoodLogDrawer = this.toggleFoodLogDrawer.bind(this);

		this.state = {
			claiming: false,
			editingFoodLog: false,
		};
	}

	onClose() {
		if (this.props.onClose) this.props.onClose();
	}

	claimRequest() {
		this.setState({ claiming: true });
	}

	closeClaimRequestDrawer() {
		this.setState({ claiming: false });
	}

	deleteRequest() {
		// console.log("Deleting request");
	}

	toggleFoodLogDrawer() {
		this.setState({ editingFoodLog: !this.state.editingFoodLog });
	}

	render() {

		console.log("Existing request drawer props", this.props);

		const { agency, agencies, open, request, date } = this.props;
		const { claiming } = this.state;

		if (!date || !request) return null;


		// const occurrence:
		// 	| RequestOccurrence
		// 	| undefined = request.occurrences?.filter(x => {
		// 	const a = x.date instanceof Date ? x.date : x.date.toDate();
		// 	return isSameDate(a, date?.toDate());
		// })[0];

		// const donatingAgency:
		// 	| firebase.firestore.QueryDocumentSnapshot
		// 	| undefined = agencies?.docs.filter(
		// 	x => x.id === request.data()?.donator
		// )[0];

		// const deliveringAgency:
		// 	| firebase.firestore.QueryDocumentSnapshot
		// 	| string
		// 	| undefined =
		// 	request.data()?.deliverer === AgencyTypes.ANY
		// 		? "Any (Unclaiemd)"
		// 		: agencies?.docs.filter(x => x.id === request.data()?.deliverer)[0];

		// let receivingAgency:
		// 	| firebase.firestore.QueryDocumentSnapshot
		// 	| string
		// 	| undefined;
		// if (request.data()?.type === RequestTypes.PICKUP) {
		// 	receivingAgency =
		// 		request.data()?.receiver === AgencyTypes.ANY
		// 			? "Any (Unclaimed)"
		// 			: agencies?.docs.filter(x => x.id === request.data()?.receiver)[0];
		// }

		// if (
		// 	!donatingAgency ||
		// 	!deliveringAgency ||
		// 	(request.data()?.type === RequestTypes.PICKUP && !receivingAgency)
		// )
		// 	return null;

		// const from = request.data()?.dates.from.toDate();
		// const to = request.data()?.dates.to.toDate();

		// const start = request.data()?.time.start.toDate();
		// const end = request.data()?.time.to.toDate();

		// const when = `
		// 	${moment(from).format("MMMM D, YYYY")}
		// 	–
		// 	${moment(to).format("MMMM D, YYYY")},
		// 	on every
		// 	${new Intl.DateTimeFormat("en-US", {
		// 		weekday: "long",
		// 	}).format(from.getDay())}
		// 	between
		// 	${moment(start).format("h:mm a")}
		// 	and
		// 	${moment(end).format("h:mm a")}
		// `;

		// const occurrenceDate =
		// 	occurrence?.date instanceof Date
		// 		? occurrence?.date
		// 		: occurrence?.date.toDate();

		// const today = new Date();

		// const foodLogButtonDisabled =
		// 	occurrence && occurrenceDate <= today ? false : true;

		const foodLogButtonDisabled = false;
		const foodLogButtonText = "Food Log";

		// const foodLogButtonText =
		// 	occurrence && occurrence.complete ? "Edit Food Log" : "Enter Food Log";

		const buttonStyles = {
			marginLeft: 8,
		};

		const defaultFooter = [
			<Button key="cancel" onClick={this.onClose} style={buttonStyles}>
				Cancel
			</Button>,
		];

		// const footer = (agencyType?: AgencyTypes): React.ReactNode[] => {
		// 	switch (agencyType) {
		// 		case AgencyTypes.DONATOR:
		// 			return [
		// 				...defaultFooter,
		// 				<Popconfirm
		// 					key="delete"
		// 					title="Delete this request series?"
		// 					okText="Yes"
		// 					onConfirm={this.deleteRequest}
		// 				>
		// 					<Button type="primary" style={buttonStyles} danger>
		// 						Delete
		// 					</Button>
		// 				</Popconfirm>,
		// 			];

		// 		case AgencyTypes.DELIVERER:
		// 			if (request?.data()?.deliverer === AgencyTypes.ANY) {
		// 				return [
		// 					...defaultFooter,
		// 					<Button
		// 						key="claim"
		// 						type="primary"
		// 						onClick={this.claimRequest}
		// 						style={buttonStyles}
		// 					>
		// 						Claim
		// 					</Button>,
		// 				];
		// 			} else {
		// 				return [
		// 					...defaultFooter,
		// 					<Button
		// 						key="food-log"
		// 						type="primary"
		// 						onClick={this.toggleFoodLogDrawer}
		// 						style={buttonStyles}
		// 						disabled={foodLogButtonDisabled}
		// 					>
		// 						{foodLogButtonText}
		// 					</Button>,
		// 				];
		// 			}

		// 		default:
		// 			return defaultFooter;
		// 	}
		// };

		return (
			<AppContext.Consumer>
				{appContext => (
					<Drawer
						// title={`
						// 	Request on ${date?.format("MMMM D, YYYY")}
						// 	(${occurrence?.complete ? "Completed" : "Not done yet"})
						// `}
						title={`Request on ${date?.format("MMMM D, YYYY")}`}
						visible={!!open}
						onClose={this.onClose}
						footer={
							<div style={{ textAlign: "right" }}>
								{/* {footer(appContext.agency?.data()?.type)} */}
							</div>
						}
					>
						<Form>
							{/* <Descriptions column={1} bordered>
								<Descriptions.Item label="When">{when}</Descriptions.Item>

								<Descriptions.Item label="Donating Agency">
									{donatingAgency.data()?.name}
									<br />
									Primary Contact: {donatingAgency.data()?.contact.name} (
									<a href={`mailto:${donatingAgency.data()?.contact.email}`}>
										{donatingAgency.data()?.contact.email}
									</a>
									)
									<br />
									<br />
									<a
										href={formGoogleMapsUrl(donatingAgency.data()?.address)}
										target="_blank"
										rel="noopener noreferrer"
									>
										Directions (Google Maps)
									</a>
								</Descriptions.Item>

								<Descriptions.Item label="Delivering Agency">
									{typeof deliveringAgency === "string"
										? deliveringAgency
										: deliveringAgency.data()?.name}

									{typeof deliveringAgency !== "string" && (
										<>
											<br />
											Primary Contact: {deliveringAgency.data()?.contact.name} (
											{
												<a
													href={`mailto:${
														deliveringAgency.data()?.contact.email
													}`}
												>
													{deliveringAgency.data()?.contact.email}
												</a>
											}
											)
											<br />
											<br />
											Deliverers
											<ul style={{ margin: "0 0 0 1.5em", paddingLeft: 0 }}>
												{request
													.data()
													?.deliverers?.map(
														(
															user: { name: string; email: string },
															index: number
														) => (
															<li key={index}>
																{user.name} (
																<a href={`mailto:${user.email}`}>
																	{user.email}
																</a>
																)
															</li>
														)
													)}
											</ul>
										</>
									)}
								</Descriptions.Item>

								{request.data()?.type === RequestTypes.PICKUP &&
									receivingAgency && (
										<Descriptions.Item label="Receiving Agency">
											{typeof receivingAgency === "string"
												? receivingAgency
												: receivingAgency.data()?.name}

											{typeof receivingAgency !== "string" && (
												<>
													<br />
													Primary Contact:{" "}
													{receivingAgency.data()?.contact.name} (
													<a
														href={`mailto${
															receivingAgency.data()?.contact.email
														}`}
													>
														{receivingAgency.data()?.contact.email}
													</a>
													)
												</>
											)}
										</Descriptions.Item>
									)}

								{request.data()?.notes && (
									<Descriptions.Item label="Notes">
										{request.data()?.notes}
									</Descriptions.Item>
								)}

								{/* {occurrence && (
									<Descriptions.Item label="Status">
										{occurrence.complete && <strong>Completed</strong>}

										{!occurrence.complete && (
											<>
												<strong>Not completed yet</strong>
												<br />
												{appContext.agency?.type === AgencyTypes.DELIVERER ? (
													<Button
														onClick={this.toggleFoodLogDrawer}
														disabled={foodLogButtonDisabled}
													>
														{foodLogButtonText}
													</Button>
												) : (
													"Did the delivering agency pick up this donation? If so, they have not confirmed this."
												)}
											</>
										)}
									</Descriptions.Item>
								)}
							</Descriptions> */}

							<p>Request id: {request}</p>
						</Form>

						{/* <ClaimRequestDrawer
							open={claiming}
							onClose={this.closeClaimRequestDrawer}
							request={request}
							agency={agency}
						/>

						<FoodLogDrawer
							open={this.state.editingFoodLog}
							onClose={this.toggleFoodLogDrawer}
							request={request}
						/> */}
					</Drawer>
				)}
			</AppContext.Consumer>
		);
	}
}

export default ExistingRequestDrawer;
