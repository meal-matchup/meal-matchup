import React, { useState } from "react";
import PropTypes from "prop-types";
import firebase from "gatsby-plugin-firebase";
import moment from "moment";
import {
	Button,
	Col,
	DatePicker,
	Divider,
	Drawer,
	Form,
	Input,
	Radio,
	Row,
	Select,
	TimePicker,
} from "antd";

import { AgencyTypes, RequestTypes } from "../../Enums";

function Request({ open = false, onClose, umbrella, agency }) {
	const [requestForm] = Form.useForm();
	const [creatingRequest, setCreatingRequest] = useState(false);
	const [requestDateRangeStatus, setRequestDateRangeStatus] = useState(null);
	const [requestTimeRangeStatus, setRequestTimeRangeStatus] = useState(false);

	const createPickupRequest = values => {
		setCreatingRequest(true);
		setRequestDateRangeStatus("validating");
		setRequestTimeRangeStatus("validating");

		let errors = false;

		const { dates, time, frequency, notes, type } = values.request;

		if (!dates) {
			setRequestDateRangeStatus("error");
			errors = true;
		}

		if (!time) {
			setRequestTimeRangeStatus("error");
			errors = true;
		}

		if (errors) {
			setCreatingRequest(false);
			return false;
		}

		// Form is valid, create request!
		const requestData = {
			umbrella: umbrella.id,
			donator: agency.id,
			deliverer: AgencyTypes.ANY,
			frequency,
			dates: {
				from: dates[0].toDate(),
				to: dates[1].toDate(),
			},
			time: {
				start: time[0].toDate(),
				to: time[1].toDate(),
			},
			type,
		};
		if (type === RequestTypes.PICKUP) {
			requestData["receiver"] = AgencyTypes.ANY;
			const occurrences = [];
			for (
				let date = dates[0].toDate();
				date <= dates[1].toDate();
				date.setDate(date.getDate() + 7)
			) {
				occurrences.push({
					date: new Date(date),
					complete: false,
				});
			}
			requestData["occurrences"] = occurrences;
		}
		if (notes) requestData["notes"] = notes;

		firebase
			.firestore()
			.collection("requests")
			.add(requestData)
			.then(() => {
				setCreatingRequest(false);
				closeDrawer();
			});
	};

	const closeDrawer = () => {
		if (!creatingRequest) onClose();
	};

	const invalidDates = now => now && now < moment().endOf("day");

	return (
		<Drawer
			className="drawer"
			title="New Request"
			visible={open}
			onClose={closeDrawer}
			footer={
				<div style={{ textAlign: "right" }}>
					<Button
						disabled={creatingRequest}
						onClick={onClose}
						style={{ marginRight: 8 }}
					>
						Cancel
					</Button>

					<Button
						disabled={creatingRequest || (agency && !agency.approved)}
						type="primary"
						onClick={requestForm.submit}
					>
						Submit
					</Button>
				</div>
			}
		>
			{agency && agency.approved ? (
				<Form
					form={requestForm}
					onFinish={createPickupRequest}
					initialValues={{
						request: {
							frequency: "weekly",
						},
					}}
					layout="vertical"
					// hideRequiredMark
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
								name={["request", "type"]}
								label="Request Type"
								rules={[
									{
										required: true,
										message: "You must select a request type",
									},
								]}
							>
								<Radio.Group>
									<Radio value={RequestTypes.BAGNTAG}>
										Bag &amp; Tag Request
									</Radio>

									<Radio value={RequestTypes.PICKUP}>Pickup Request</Radio>
								</Radio.Group>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								label="Date range"
								name={["request", "dates"]}
								validateStatus={requestDateRangeStatus}
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
								label="Choose pickup time"
								name={["request", "time"]}
								validateStatus={requestTimeRangeStatus}
							>
								<TimePicker.RangePicker
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
							<Form.Item label="Frequency" name={["request", "frequency"]}>
								<Select disabled={creatingRequest}>
									<Select.Option value="weekly">Weekly</Select.Option>
									<Select.Option value="biweekly">Biweekly</Select.Option>
								</Select>
							</Form.Item>

							<Form.Item label="Notes" name={["request", "notes"]}>
								<Input.TextArea disabled={creatingRequest} rows={4} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			) : (
				<Row gutter={16}>
					<Col span={24}>
						<p>
							Sorry! Your account has not been approved yet. You will receive an
							email once your account is approved, and then you will be able to
							start creating requests!
						</p>
					</Col>
				</Row>
			)}
		</Drawer>
	);
}

Request.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	umbrella: PropTypes.shape({
		id: PropTypes.string.isRequired,
	}),
	agency: PropTypes.shape({
		id: PropTypes.string.isRequired,
		approved: PropTypes.bool.isRequired,
	}).isRequired,
};

export default Request;
