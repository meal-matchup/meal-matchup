import React, { useState } from 'react';
import PropTypes from 'prop-types';
import firebase from 'gatsby-plugin-firebase';
import moment from 'moment';
import {
	Button,
	Col,
	DatePicker,
	Drawer,
	Form,
	Input,
	Row,
	Select,
	TimePicker,
} from 'antd';

import { AgencyTypes, RequestTypes } from '../../Enums';

function PickupRequest({ open = false, onClose, umbrella, agency, agencies }) {
	const [pickupRequestForm] = Form.useForm();
	const [creatingPickupRequest, setCreatingPickupRequest] = useState(false);
	const [pickupDateRangeStatus, setPickupDateRangeStatus] = useState(null);
	const [pickupTimeRangeStatus, setPickupTimeRangeStatus] = useState(false);

	const createPickupRequest = (values) => {
		setCreatingPickupRequest(true);
		setPickupDateRangeStatus('validating');
		setPickupTimeRangeStatus('validating');

		let errors = false;

		const {
			dates,
			time,
			frequency,
			notes,
			deliverer,
			receiver,
		} = values.pickup;

		if (!dates) {
			setPickupDateRangeStatus('error');
			errors = true;
		}

		if (!time) {
			setPickupTimeRangeStatus('error');
			errors = true;
		}

		if (errors) {
			setCreatingPickupRequest(false);
			return false;
		}

		// Form is valid, create request!
		const requestData = {
			umbrella: umbrella.id,
			donator: agency.id,
			receiver,
			deliverer,
			frequency,
			dates: {
				from: dates[0].toDate(),
				to: dates[1].toDate(),
			},
			time: {
				start: time[0].toDate(),
				to: time[1].toDate(),
			},
			type: RequestTypes.PICKUP,
		};
		if (notes) requestData['notes'] = notes;

		firebase
			.firestore()
			.collection('requests')
			.add(requestData)
			.then(() => {
				setCreatingPickupRequest(false);
				closeDrawer();
			});
	};

	const closeDrawer = () => {
		if (!creatingPickupRequest) onClose();
	};

	const invalidDates = (now) => now && now < moment().endOf('day');

	return (
		<Drawer
			className="drawer"
			title="New Recurring Pickup Request"
			visible={open}
			onClose={closeDrawer}
			footer={
				<div style={{ textAlign: 'right' }}>
					<Button
						disabled={creatingPickupRequest}
						onClick={onClose}
						style={{ marginRight: 8 }}
					>
						Cancel
					</Button>

					<Button
						disabled={creatingPickupRequest}
						type="primary"
						onClick={pickupRequestForm.submit}
					>
						Submit
					</Button>
				</div>
			}
		>
			<Form
				form={pickupRequestForm}
				onFinish={createPickupRequest}
				initialValues={{
					pickup: {
						frequency: 'weekly',
					},
				}}
				layout="vertical"
				// hideRequiredMark
			>
				<Row gutter={16}>
					<Col span={24}>
						<p>
							Use this form to schedule a recurring pickup request. If accepted,
							a delivering agency will pickup your donations in the timeframe
							you specify.
						</p>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label="Date range"
							name={['pickup', 'dates']}
							validateStatus={pickupDateRangeStatus}
						>
							<DatePicker.RangePicker
								disabled={creatingPickupRequest}
								format="MMMM D, YYYY"
								disabledDate={invalidDates}
								style={{
									width: '100%',
								}}
							/>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							label="Choose pickup time"
							name={['pickup', 'time']}
							validateStatus={pickupTimeRangeStatus}
						>
							<TimePicker.RangePicker
								disabled={creatingPickupRequest}
								format="h:mm a"
								use12Hours={true}
								minuteStep={10}
								style={{
									width: '100%',
								}}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label="Frequency" name={['pickup', 'frequency']}>
							<Select disabled={creatingPickupRequest}>
								<Select.Option value="weekly">Weekly</Select.Option>
								<Select.Option value="biweekly">Biweekly</Select.Option>
							</Select>
						</Form.Item>

						<Form.Item label="Notes" name={['pickup', 'notes']}>
							<Input.TextArea disabled={creatingPickupRequest} rows={4} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label="Deliverer"
							name={['pickup', 'deliverer']}
							rules={[
								{
									required: true,
									message: 'Please select a delivering agency',
								},
							]}
						>
							<Select disabled={creatingPickupRequest}>
								{agencies.map((theAgency) => {
									if (theAgency.type === AgencyTypes.DELIVERER) {
										return (
											<Select.Option key={theAgency.id} value={theAgency.id}>
												{theAgency.name}
											</Select.Option>
										);
									}
								})}
								<Select.Option value="any">Any</Select.Option>
							</Select>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							label="Receiver"
							name={['pickup', 'receiver']}
							rules={[
								{
									required: true,
									message: 'Please select a delivering agency',
								},
							]}
						>
							<Select disabled={creatingPickupRequest}>
								{agencies.map((theAgency) => {
									if (theAgency.type === AgencyTypes.RECEIVER) {
										return (
											<Select.Option key={theAgency.id} value={theAgency.id}>
												{theAgency.name}
											</Select.Option>
										);
									}
								})}
								<Select.Option value="any">Any</Select.Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Drawer>
	);
}

PickupRequest.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	umbrella: PropTypes.shape({
		id: PropTypes.string.isRequired,
	}),
	agency: PropTypes.shape({
		id: PropTypes.string.isRequired,
	}).isRequired,
	agencies: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
		})
	).isRequired,
};

export default PickupRequest;
