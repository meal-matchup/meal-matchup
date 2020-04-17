import React, { useState, useEffect } from 'react';
import firebase from 'gatsby-plugin-firebase';
import moment from 'moment';
import {
	Calendar,
	Drawer,
	Button,
	Form,
	Row,
	Col,
	Input,
	DatePicker,
	TimePicker,
	Select,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import debug from 'debug';

import App, { AppPages } from '../../components/App';
import SEO from '../../components/SEO';

const { Option } = Select;
const { TextArea } = Input;

function IndexPage() {
	const [user, setUser] = useState(null);
	const [agency, setAgency] = useState(null);

	useEffect(() => {
		if (!firebase) return;

		return firebase.auth().onAuthStateChanged((newUser) => {
			setUser(newUser);

			if (newUser) {
				firebase
					.firestore()
					.collection('users')
					.doc(newUser.uid)
					.get()
					.then((doc) => {
						if (doc && doc.data() && doc.data().agency) {
							doc
								.data()
								.agency.get()
								.then((agencyDoc) => {
									if (agencyDoc && agencyDoc.data()) {
										setAgency(agencyDoc.data().type);
									}
								})
								.catch((e) => {
									debug('Could not get agency', e);
								});
						} else {
							debug(doc.data());
						}
					})
					.catch((e) => {
						debug('Couldnt get user doc', e);
					});
			} else {
				setAgency(null);
			}
		});
	}, [user, agency]);

	const [creatingPickupRequest, setCreatingPickupRequest] = useState(false);
	const [pickupRequestOpen, setPickupRequestOpen] = useState(false);
	const [pickupRequestForm] = Form.useForm();
	const [pickupDateRangeStatus, setPickupDateRangeStatus] = useState(null);
	const [pickupTimeRangeStatus, setPickupTimeRangeStatus] = useState(null);

	const invalidDates = (now) => now && now < moment().endOf('day');

	const createPickupRequest = (values) => {
		const {
			dates,
			time,
			frequency,
			notes,
			deliverer,
			receiver,
		} = values.pickup;
		setCreatingPickupRequest(true);
		setPickupDateRangeStatus('validating');
		setPickupTimeRangeStatus('validating');

		if (!dates) {
			setPickupDateRangeStatus('error');
			return;
		}
		if (!time) {
			setPickupTimeRangeStatus('error');
			return;
		}

		// firebase.firestore().collection('requests').
	};

	return (
		<App pageId={AppPages.Calendar}>
			<SEO title="Meal Matchup" description="" />

			<div className="events-calendar">
				<Calendar validRange={0} />

				<div className="calendar-buttons-container">
					{agency && (
						<Button type="primary" onClick={() => setPickupRequestOpen(true)}>
							<PlusOutlined /> New Pickup Request
						</Button>
					)}
				</div>

				<Drawer
					className="drawer"
					title="New Pickup Request"
					visible={pickupRequestOpen}
					onClose={() => setPickupRequestOpen(false)}
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
										<Option value="weekly">Weekly</Option>
										<Option value="biweekly">Biweekly</Option>
									</Select>
								</Form.Item>

								<Form.Item label="Notes" name={['pickup', 'notes']}>
									<TextArea disabled={creatingPickupRequest} rows={4} />
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
										<Option value="HCDEsa">HCDE Student Association</Option>
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
										<Option value="shelter">Local Shelter</Option>
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
			</div>
		</App>
	);
}

export default IndexPage;
