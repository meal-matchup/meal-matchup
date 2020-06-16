import {
	AgencyTypes,
	Request,
	RequestOccurrence,
	RequestTypeNames,
	RequestTypes,
} from "../../../utils/enums";
import {
	Button,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	Radio,
	Row,
	Select,
	TimePicker,
} from "antd";
import { Drawer } from "../";
import React from "react";
import { Store } from "antd/lib/form/interface";
import firebase from "gatsby-plugin-firebase";
import moment from "moment";

interface NewRequestDrawerProps {
	agencyId?: string;
	onClose?: () => void;
	open?: boolean;
	umbrellaId?: string;
}

interface NewRequestDrawerState {
	creatingRequest: boolean;
	dateRangeStatus?: "" | "error" | "success" | "warning" | "validating";
	timeRangeStatus?: "" | "error" | "success" | "warning" | "validating";
}

class NewRequestDrawer extends React.Component<
	NewRequestDrawerProps,
	NewRequestDrawerState
> {
	/** Initializes the new request drawer */
	constructor(props: NewRequestDrawerProps) {
		super(props);

		this.onClose = this.onClose.bind(this);
		this.createRequest = this.createRequest.bind(this);

		this.state = {
			creatingRequest: false,
		};
	}

	/** Creates a request from the form values */
	createRequest(values: Store) {
		const { umbrellaId, agencyId } = this.props;

		// If there is not umbrella or agency ID, we cannot create a request.
		if (!umbrellaId || !agencyId) return false;

		this.setState({
			creatingRequest: true,
		});

		// We can use this to account for multiple errors
		let errors = false;

		// Values we need from our form
		const { dates, time, frequency, notes, type } = values;

		if (!dates) {
			this.setState({ dateRangeStatus: "error" });
			errors = true;
		}

		if (!time) {
			this.setState({ timeRangeStatus: "error" });
			errors = true;
		}

		// After checking for errors, don't submit if there are any
		// @TODO: maybe show an ant.design message in this case
		if (errors) {
			this.setState({ creatingRequest: false });
			return false;
		}

		// For the request data for our database
		const requestData: Request = {
			dates: {
				from: dates[0].toDate(),
				to: dates[1].toDate(),
			},
			deleted: false,
			donator: agencyId,
			deliverer: AgencyTypes.ANY,
			receiver: AgencyTypes.ANY,
			umbrella: umbrellaId,
			frequency,
			time: {
				start: time[0].toDate(),
				to: time[1].toDate(),
			},
			type,
		};

		// Create standardized dates for our requests
		const startDate: Date = dates[0].toDate();
		startDate.setHours(0, 0, 0, 0);
		const endDate: Date = dates[1].toDate();
		endDate.setDate(endDate.getDate());
		endDate.setHours(0, 0, 0, 0);

		// Create an array to keep track of individual occurrences
		const occurrences: RequestOccurrence[] = [];

		// Create an occurrence for each week through the end date
		for (
			let date = startDate;
			date <= endDate;
			date.setDate(date.getDate() + 7)
		) {
			occurrences.push({
				date: new Date(date),
				complete: false,
			});
		}

		// Add notes if there are any
		if (notes) requestData.notes = notes;

		firebase
			.firestore()
			.collection("requests")
			.add(requestData)
			.then(requestDoc => {
				const batch = firebase.firestore().batch();

				occurrences.forEach(occurrence => {
					const occurrenceRef = firebase
						.firestore()
						.collection("requests")
						.doc(requestDoc.id)
						.collection("occurrences")
						.doc();

					batch.set(occurrenceRef, occurrence);
				});

				batch.commit().then(() => {
					this.setState({ creatingRequest: false });
					this.onClose();
				});
			});
	}

	/** What happens when the drawer is closed */
	onClose() {
		if (this.props.onClose && !this.state.creatingRequest) this.props.onClose();
	}

	/** Renders the new request drawer */
	render() {
		const { creatingRequest, dateRangeStatus, timeRangeStatus } = this.state;
		const { open } = this.props;

		// Don't let users create a request for yesterday and before
		const invalidDates = (now: moment.Moment) =>
			now && now < moment().endOf("day");

		const formId = "create-reqeust-form";

		return (
			<Drawer
				title="New Request"
				visible={!!open}
				onClose={this.onClose}
				footer={
					<div style={{ textAlign: "right" }}>
						<Button
							disabled={creatingRequest}
							onClick={this.onClose}
							style={{ marginRight: 8 }}
						>
							Cancel
						</Button>

						<Button
							disabled={creatingRequest}
							type="primary"
							htmlType="submit"
							form={formId}
						>
							Submit
						</Button>
					</div>
				}
			>
				<Form
					id={formId}
					onFinish={this.createRequest}
					initialValues={{
						frequency: "weekly",
					}}
					layout="vertical"
				>
					<Row gutter={16}>
						<Col span={24}>
							<p>
								Use this form to schedule a new request. If accepted, a
								Delivering Agency will either <strong>Bag &amp; Tag</strong> or{" "}
								<strong>Pickup</strong> your donations in the timeframe you
								specify.
							</p>
							<p>
								<strong>Bag &amp; Tag:</strong> A Bag &amp; Tag Request asks a
								Delivering Agency to come to your location. Then, they will
								properly bag, weigh, label, and freeze your donations.
							</p>
							<p>
								<strong>Pickup:</strong> A Pickup Request asks a Delivering
								Agency to come to your location and pick up a proprly bagged and
								frozen donation. From there, they will deliver the donation to a
								Receiving Agency.
							</p>
						</Col>
					</Row>

					<Divider />

					<Row gutter={16}>
						<Col span={24}>
							<Form.Item
								name="type"
								label="Request Type"
								rules={[
									{
										required: true,
										message: "You must select a request type",
									},
								]}
							>
								<Radio.Group>
									<Radio
										disabled={creatingRequest}
										value={RequestTypes.BAGNTAG}
									>
										{RequestTypeNames[RequestTypes.BAGNTAG]}
									</Radio>

									<Radio disabled={creatingRequest} value={RequestTypes.PICKUP}>
										{RequestTypeNames[RequestTypes.PICKUP]}
									</Radio>
								</Radio.Group>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="dates"
								label="Date range"
								validateStatus={dateRangeStatus}
							>
								<DatePicker.RangePicker
									disabled={creatingRequest}
									format="MMMM D, YYYY"
									disabledDate={invalidDates}
									style={{
										width: "100%",
									}}
								/>
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item
								name="time"
								label="Choose pickup time"
								validateStatus={timeRangeStatus}
							>
								<TimePicker.RangePicker
									picker="time"
									disabled={creatingRequest}
									format="h:mm a"
									use12Hours={true}
									minuteStep={10}
									style={{
										width: "100%",
									}}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={24}>
							<Form.Item name="frequency" label="Frequency">
								<Select disabled={creatingRequest}>
									<Select.Option value="weekly">Weekly</Select.Option>
									<Select.Option value="biweekly">Biweekly</Select.Option>
								</Select>
							</Form.Item>

							<Form.Item name="notes" label="Notes">
								<Input.TextArea disabled={creatingRequest} rows={4} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Drawer>
		);
	}
}

export default NewRequestDrawer;
