import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
	Button,
	Calendar,
	Col,
	DatePicker,
	Drawer,
	Form,
	Input,
	Row,
	Select,
	TimePicker,
} from 'antd';

import { AgencyTypes } from '../Enums';

function CalendarView({ agency, agencies }) {
	// Variables for pickup request form
	const [pickupRequestDrawerOpen, setPickupRequestDrawerOpen] = useState(false);
	const [creatingPickupRequest, setCreatingPickupRequest] = useState(false);
	const [pickupDateRangeStatus, setPickupDateRangeStatus] = useState(null);
	const [pickupTimeRangeStatus, setPickupTimeRangeStatus] = useState(null);
	const [pickupRequestForm] = Form.useForm();

	const invalidDates = (now) => now && now < moment().endOf('day');

	// @TODO: implement pickup request function
	const createPickupRequest = (values) => {};

	return (
		<>
			<div className="events-calendar">
				<Calendar />
			</div>

			<div className="calendar-buttons-container">
				{agency && agency.type === AgencyTypes.DONATOR && agencies && (
					<Button
						type="primary"
						onClick={() => setPickupRequestDrawerOpen(true)}
					>
						New Pickup Request
					</Button>
				)}
			</div>

			{agency && agency.type === AgencyTypes.DONATOR && agencies && (
				<Drawer
					className="drawer"
					title="New Pickup Request"
					visible={pickupRequestDrawerOpen}
					onClose={() => setPickupRequestDrawerOpen(false)}
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
													<Select.Option
														key={theAgency.id}
														value={theAgency.id}
													>
														{theAgency.name}
													</Select.Option>
												);
											}
										})}
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
													<Select.Option
														key={theAgency.id}
														value={theAgency.id}
													>
														{theAgency.name}
													</Select.Option>
												);
											}
										})}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Form.Item>
								<Button
									disabled={creatingPickupRequest}
									type="primary"
									htmlType="submit"
								>
									Submit
								</Button>
							</Form.Item>
						</Row>
					</Form>
				</Drawer>
			)}
		</>
	);
}

CalendarView.propTypes = {
	agency: PropTypes.shape({
		id: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}),
	agencies: PropTypes.array,
};

export default CalendarView;
