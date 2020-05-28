import { Button, Descriptions } from "antd";
import { AgencyTypes } from "../../../utils/enums";
import ClaimRequestDrawer from "./ClaimRequestDrawer";
import { Drawer } from "../";
import React from "react";
import { isSameDate } from "../../../utils/functions";
import moment from "moment";

interface ExistingRequestDrawerProps {
	agency?: firebase.firestore.DocumentSnapshot;
	date?: moment.Moment;
	open?: boolean;
	request?: firebase.firestore.DocumentSnapshot;
	onClose?: () => void;
}

interface ExistingRequestDrawerState {
	claiming: boolean;
	editingFoodLog: boolean;
	occurrence?: firebase.firestore.DocumentSnapshot;
}

class ExistingRequestDrawer extends React.Component<
	ExistingRequestDrawerProps,
	ExistingRequestDrawerState
> {
	constructor(props: ExistingRequestDrawerProps) {
		super(props);

		this.onClose = this.onClose.bind(this);
		this.toggleClaimRequestModal = this.toggleClaimRequestModal.bind(this);

		this.state = {
			claiming: false,
			editingFoodLog: false,
		};
	}

	getOccurrence() {
		// const { date, request } = this.props;

		// if (!request || !date) return this.setState({ occurrence: undefined });

		// const setState = this.setState.bind(this);

		// request.ref.collection("occurrences").onSnapshot(snapshot => {
		// 	const occurrences = snapshot.docs.filter(x =>
		// 		isSameDate(x.data()?.date.toDate(), date.toDate())
		// 	);

		// 	if (occurrences) {
		// 		return setState({ occurrence: occurrences[0] });
		// 	}
		// });

		const { date, request } = this.props;

		if (!request || !date) {
			this.setState({ occurrence: undefined });
			return false;
		}

		const setState = this.setState.bind(this);

		request.ref
			.collection("occurrences")
			.get()
			.then(snapshot => {
				const occurrences = snapshot.docs.filter(x =>
					isSameDate(x.data()?.date.toDate(), date.toDate())
				);

				if (occurrences && occurrences.length > 0) {
					setState({ occurrence: occurrences[0] });
				}
			});

		return this.setState({ occurrence: undefined });
	}

	onClose() {
		if (this.props.onClose) this.props.onClose();
	}

	toggleClaimRequestModal() {
		this.setState({ claiming: !this.state.claiming });
	}

	componentDidMount() {
		this.getOccurrence();
	}

	componentDidUpdate(prevProps: ExistingRequestDrawerProps) {
		if (
			(this.props.request && !prevProps.request) ||
			(!this.props.request && prevProps.request)
		) {
			this.getOccurrence();
		}
	}

	render() {
		const { agency, date, open, request } = this.props;
		const { occurrence } = this.state;

		if (!agency || !request || !date) return null;

		const donatingAgency: firebase.firestore.QueryDocumentSnapshot = agencies

		const when = "hi";

		const buttonStyles = {
			marginLeft: 8,
		};

		const defaultFooter = [
			<Button key="cancel" onClick={this.onClose} style={buttonStyles}>
				Cancel
			</Button>,
		];

		const footer = (): React.ReactNode[] => {
			switch (agency.data()?.type) {
				case AgencyTypes.DELIVERER:
					if (request.data()?.deliverer === AgencyTypes.ANY) {
						return [
							...defaultFooter,
							<Button
								key="claim"
								type="primary"
								onClick={this.toggleClaimRequestModal}
								style={buttonStyles}
							>
								Claim
							</Button>,
						];
					} else {
						return [
							...defaultFooter,
							<Button key="food-log" type="primary" style={buttonStyles}>
								Enter Food Log
							</Button>,
						];
					}

				default:
					return defaultFooter;
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
						<Descriptions.Item label="Occurrence ID">
							{occurrence?.id || "None"}
						</Descriptions.Item>
					</Descriptions>

					<ClaimRequestDrawer
						open={this.state.claiming}
						onClose={this.toggleClaimRequestModal}
						request={request}
						agency={agency}
					/>
				</Drawer>
			</>
		);
	}
}

export default ExistingRequestDrawer;
