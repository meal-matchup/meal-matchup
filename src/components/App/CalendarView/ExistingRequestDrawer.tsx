import AppContext from "../AppContext";
import { Descriptions } from "antd";
import { Drawer } from "../";
import React from "react";
import { isSameDate } from "../../../utils/functions";
import moment from "moment";

interface ExistingRequestDrawerProps {
	open?: boolean;
	request?: string;
	date?: moment.Moment;
	onClose?: () => void;
}

interface ExistingRequestDrawerState {
	claiming: boolean;
	editingFoodLog: boolean;
	occurrenceId?: string;
}

class ExistingRequestDrawer extends React.Component<
	ExistingRequestDrawerProps,
	ExistingRequestDrawerState
> {
	constructor(props: ExistingRequestDrawerProps) {
		super(props);

		this.onClose = this.onClose.bind(this);

		this.state = {
			claiming: false,
			editingFoodLog: false,
		};
	}

	onClose() {
		if (this.props.onClose) this.props.onClose();
	}

	render() {
		const { date, open, request } = this.props;
		const { occurrenceId } = this.state;

		const setState = this.setState.bind(this);

		if (!request || !date) return null;

		const when = "hi";

		return (
			<AppContext.Consumer>
				{appContext => {
					const currentRequest = appContext.requests?.docs.filter(
						x => x.id === request
					)[0];
					if (currentRequest) {
						currentRequest?.ref
							.collection("occurrences")
							.get()
							.then(snapshot => {
								const occurrenceId = snapshot.docs.filter(x =>
									isSameDate(x.data().date.toDate(), date.toDate())
								)[0]?.id;

								setState({ occurrenceId });
							});
					} else {
						setState({ occurrenceId: undefined });
					}

					return (
						<Drawer title="Request" visible={!!open} onClose={this.onClose}>
							<Descriptions column={1} bordered>
								<Descriptions.Item label="When">{when}</Descriptions.Item>
								<Descriptions.Item label="Occurrence ID">
									{occurrenceId || "None"}
								</Descriptions.Item>
							</Descriptions>
						</Drawer>
					);
				}}
			</AppContext.Consumer>
		);
	}
}

export default ExistingRequestDrawer;
