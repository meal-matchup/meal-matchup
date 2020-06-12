import {
	AgencyTypeNames,
	AgencyTypes,
	RequestTypes,
} from "../../../utils/enums";
import { Button, Descriptions } from "antd";
import { formGoogleMapsUrl, isSameDate } from "../../../utils/functions";
import ClaimRequestDrawer from "./ClaimRequestDrawer";
import Debug from "debug";
import { Drawer } from "../";
import FoodLogDrawer from "./FoodLogDrawer";
import React from "react";
import moment from "moment";

const debug = Debug("http");

interface ExistingRequestDrawerProps {
	agencies?: firebase.firestore.QuerySnapshot;
	agency?: firebase.firestore.QueryDocumentSnapshot;
	date?: moment.Moment;
	open?: boolean;
	request?: firebase.firestore.QueryDocumentSnapshot;
	onClose?: () => void;
	userData?: firebase.firestore.DocumentData;
}

interface ExistingRequestDrawerState {
	claiming: boolean;
	editingFoodLog: boolean;
	mounted: boolean;
	occurrence?: firebase.firestore.QueryDocumentSnapshot;
	settingOccurrenceSnapshot: boolean;
}

class ExistingRequestDrawer extends React.Component<
	ExistingRequestDrawerProps,
	ExistingRequestDrawerState
> {
	/** Initializes the existing request drawer */
	constructor(props: ExistingRequestDrawerProps) {
		super(props);

		this.onClose = this.onClose.bind(this);
		this.toggleClaimRequestDrawer = this.toggleClaimRequestDrawer.bind(this);
		this.toggleFoodLogDrawer = this.toggleFoodLogDrawer.bind(this);
		this.resetSnapshots = this.resetSnapshots.bind(this);

		this.state = {
			claiming: false,
			editingFoodLog: false,
			mounted: false,
			settingOccurrenceSnapshot: false,
		};
	}

	/** A void function used as a placeholder */
	static defaultSnapshot(): void {
		debug("There is no listener");
		return void 0;
	}

	/** A function to be replaced by a firebase snapsot listener */
	occurrenceSnapshot(): void {
		return ExistingRequestDrawer.defaultSnapshot();
	}

	/** Calls the snapshot listener functions to end them, then resets them */
	resetSnapshots() {
		this.occurrenceSnapshot();
		this.occurrenceSnapshot = ExistingRequestDrawer.defaultSnapshot;
	}

	/** Runs when the drawer is closed */
	onClose() {
		if (this.props.onClose) this.props.onClose();
	}

	/** Toggles the claim request drawer */
	toggleClaimRequestDrawer() {
		this.setState({ claiming: !this.state.claiming });
	}

	/** Toggles the food log drawer */
	toggleFoodLogDrawer() {
		this.setState({ editingFoodLog: !this.state.editingFoodLog });
	}

	/** Sets the state mounted to true when mounted */
	componentDidMount() {
		this.setState({ mounted: true });
	}

	/** Runs when the component props or state changes */
	componentDidUpdate() {
		/**
		 * If the component is not open but there is an occurence in the state,
		 * reset the snapshots and remove the occurrence from the state.
		 */
		if (!this.props.open && this.state.occurrence) {
			// Remove occurrence
			this.resetSnapshots();
			this.setState({ occurrence: undefined });
		}

		/**
		 * If the drawer is open, there is a request in the state, and there is a
		 * date in the state, we can get the individual occurrence if we are
		 * not already.
		 */
		if (
			this.props.open &&
			this.props.request &&
			this.props.date &&
			!this.state.occurrence &&
			!this.state.settingOccurrenceSnapshot
		) {
			this.setState({ settingOccurrenceSnapshot: true });

			const { date, request } = this.props;

			this.occurrenceSnapshot = request.ref
				.collection("occurrences")
				.onSnapshot(snapshot => {
					const occurrences = snapshot.docs.filter(x =>
						isSameDate(x.data()?.date.toDate(), date.toDate())
					);

					if (
						occurrences &&
						occurrences.length > 0 &&
						this.props.open &&
						this.props.request?.id === request.id
					) {
						this.setState({
							occurrence: occurrences[0],
							settingOccurrenceSnapshot: false,
						});
					}
				});
		}
	}

	/** Renders the existing request drawer */
	render() {
		const { agencies, agency, date, open, request, userData } = this.props;
		const { occurrence } = this.state;

		if (!agencies || !request || !date) return null;

		const donatingAgency: firebase.firestore.QueryDocumentSnapshot = agencies.docs.filter(
			x => x.id === request.data()?.donator
		)[0];

		const deliveringAgency: firebase.firestore.QueryDocumentSnapshot | string =
			request.data()?.deliverer === AgencyTypes.ANY
				? "Any (Unclaimed)"
				: agencies.docs.filter(x => x.id === request.data()?.deliverer)[0];

		let receivingAgency:
			| firebase.firestore.QueryDocumentSnapshot
			| string
			| undefined;

		if (request.data()?.type === RequestTypes.PICKUP) {
			receivingAgency =
				request.data()?.receiver === AgencyTypes.ANY
					? "Any (Unclaimed)"
					: agencies.docs.filter(x => x.id === request.data()?.receiver)[0];
		}

		if (
			!donatingAgency ||
			!deliveringAgency ||
			(request.data()?.type === RequestTypes.PICKUP && !receivingAgency)
		) {
			return null;
		}

		const from = request.data()?.dates.from.toDate();
		const to = request.data()?.dates.to.toDate();
		const start = request.data()?.time.start.toDate();
		const end = request.data()?.time.to.toDate();

		const when = `
			${moment(from).format("MMMM D, YYYY")}
			–
			${moment(to).format("MMMM D, YYYY")},
			on every
			${new Intl.DateTimeFormat("en-US", {
				weekday: "long",
			}).format(from.getDay())}
			between
			${moment(start).format("h:mm a")}
			and
			${moment(end).format("h:mm a")}
		`;

		const foodLogButtonDisabled =
			occurrence && occurrence.data()?.date.toDate() <= new Date()
				? false
				: true;

		const foodLogButtonText =
			occurrence && occurrence.data()?.complete
				? "Edit Food Log"
				: "Enter Food Log";

		const buttonStyles = {
			marginLeft: 8,
		};

		const defaultFooter = [
			<Button key="cancel" onClick={this.onClose} style={buttonStyles}>
				Cancel
			</Button>,
		];

		/**
		 * Creates a footer based on the user's admin status and their agency type
		 *
		 * @returns An array of react nodes for the drawer footer
		 */
		const footer = (): React.ReactNode[] => {
			if (userData?.admin == true) {
				return [...defaultFooter];
			} else if (!agency) {
				return [...defaultFooter];
			} else {
				switch (agency.data()?.type) {
					case AgencyTypes.DELIVERER:
						/**
						 * Deliverers can either claim unclaimed requests or they can enter
						 * the food log if they have completed the request.
						 */
						if (request.data()?.deliverer === AgencyTypes.ANY) {
							return [
								...defaultFooter,
								<Button
									key="claim"
									type="primary"
									disabled={!agency.data()?.approved}
									onClick={this.toggleClaimRequestDrawer}
									style={buttonStyles}
								>
									Claim
								</Button>,
							];
						} else {
							return [
								...defaultFooter,
								<Button
									key="food-log"
									type="primary"
									style={buttonStyles}
									onClick={this.toggleFoodLogDrawer}
									disabled={foodLogButtonDisabled}
								>
									{foodLogButtonText}
								</Button>,
							];
						}

					case AgencyTypes.RECEIVER:
						// Receivers can claim unclaimed requests
						if (request.data()?.receiver === AgencyTypes.ANY) {
							return [
								...defaultFooter,
								<Button
									key="claim"
									type="primary"
									disabled={!agency.data()?.approved}
									onClick={this.toggleClaimRequestDrawer}
									style={buttonStyles}
								>
									Claim
								</Button>,
							];
						} else {
							return [...defaultFooter];
						}

					default:
						return defaultFooter;
				}
			}
		};

		return (
			<>
				<Drawer
					title="Request"
					visible={!!open}
					onClose={this.onClose}
					footer={<div style={{ textAlign: "right" }}>{footer()}</div>}
				>
					<Descriptions column={1} bordered>
						<Descriptions.Item label="When">{when}</Descriptions.Item>

						<Descriptions.Item label={AgencyTypeNames[AgencyTypes.DONATOR]}>
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

						<Descriptions.Item label={AgencyTypeNames[AgencyTypes.DELIVERER]}>
							{typeof deliveringAgency === "string"
								? deliveringAgency
								: deliveringAgency.data()?.name}

							{typeof deliveringAgency !== "string" && (
								<>
									<br />
									Primary Contact: {deliveringAgency.data()?.contact.name} (
									{
										<a
											href={`mailto:${deliveringAgency.data()?.contact.email}`}
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
														<a href={`mailto:${user.email}`}>{user.email}</a>)
													</li>
												)
											)}
									</ul>
								</>
							)}
						</Descriptions.Item>

						{request.data()?.type === RequestTypes.PICKUP && receivingAgency && (
							<Descriptions.Item label="Receiving Agency">
								{typeof receivingAgency === "string"
									? receivingAgency
									: receivingAgency.data()?.name}

								{typeof receivingAgency !== "string" && (
									<>
										<br />
										Primary Contact: {receivingAgency.data()?.contact.name} (
										<a href={`mailto${receivingAgency.data()?.contact.email}`}>
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

						{occurrence && request.data()?.deliverer !== AgencyTypes.ANY && (
							<Descriptions.Item label="Status">
								{occurrence.data()?.complete && <strong>Completed</strong>}

								{!occurrence.data()?.complete && (
									<>
										<strong>Not completed yet</strong>
										<br />
										{agency?.data()?.type === AgencyTypes.DELIVERER ? (
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
					</Descriptions>

					<ClaimRequestDrawer
						open={this.state.claiming}
						onClose={this.toggleClaimRequestDrawer}
						request={request}
						agency={agency}
					/>

					<FoodLogDrawer
						open={this.state.editingFoodLog}
						onClose={this.toggleFoodLogDrawer}
						request={request}
						occurrence={occurrence}
					/>
				</Drawer>
			</>
		);
	}
}

export default ExistingRequestDrawer;
