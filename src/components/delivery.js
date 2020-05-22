import React, { useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import firebase from 'gatsby-plugin-firebase';
import { AgencyTypes } from './App/Enums';
import {
	Layout,
	Row,
	Col,
	Divider,
	Steps,
	Button,
	message,
	Card,
	Form,
	Input,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import debug from 'debug';

function Delivery({ date, receiverInfo, donatorInfo, requestID }) {
	function formGoogleMapsURL(address) {
		// Uncomment if you want to give this an agency object and change address to agency above
		//let address = agency.address.line1;
		//if (agency.address.line2) address += ` ${agency.address.line2}`;
		//address += `, ${agency.address.city}, ${agency.address.state} ${agency.address.zip}`;
		return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
			address
		)}`;
	}

	const [items, setItems] = useState([]);
	const [donatorContact, setDonatorContact] = useState('');
	const [receiverContact, setReceiverContact] = useState('');
	const [initialValues, setInitialValues] = useState({});

	const [itemsForm] = Form.useForm();

	useEffect(() => {
		function getFieldValues() {
			const theValues = {};
			if (items) {
				items.forEach((user, index) => {
					if (user) {
						theValues[`user${index}`] = {
							name: user.name,
							pounds: user.pounds,
						};
					}
				});
			}
			return theValues;
		}

		setInitialValues(getFieldValues());
	}, [items]);

	useEffect(() => {
		itemsForm.setFieldsValue(initialValues);
	}, [itemsForm, initialValues]);

	const onFinishDelivery = (values) => {
		setReceiverContact(values.receivingSignOff);
		const logData = {
			food_logs: items,
			requestID: requestID,
			donator_signature: donatorContact,
			receiver_signature: values.receivingSignOff,
		};
		firebase
			.firestore()
			.collection('logs')
			.add(logData)
			.then(() => {
				message.success('Delivery Complete!');
			})
			.catch(() => {
				message.error('Could not save delivery form');
			});
	};

	const onFinishDonating = (values) => {
		setDonatorContact(values.donatingSignOff);
		setCurrent(current + 1);
	};

	const onFinishFoodLog = (values) => {
		let newNames = values.names
		setItems(newNames);
		setCurrent(current + 1);
	};

	const { Step } = Steps;
	const [current, setCurrent] = useState(0);

	const steps = [
		{
			title: 'Pick Up',
			content: (
				<div>
					<h3> Please pick up the donation from:</h3>
					<Card title={donatorInfo.name} style={{ width: '91vw' }}>
						<p> Primary Contact: {' ' + donatorInfo.contact_person} </p>

						<div
							style={{
								marginBottom: '1em',
								display: 'flex',
								flexDirection: 'row',
							}}
						>
							<p style={{ marginBottom: 0, marginRight: 3 }}>Phone Number:</p>
							<a href={'tel:+' + donatorInfo.phone_number}>
								{donatorInfo.phone_number}
							</a>
						</div>
						<a
							href={formGoogleMapsURL(donatorInfo.address)}
							target="_blank"
							rel="noopener noreferrer"
						>
							{donatorInfo.address}
						</a>
					</Card>
					<br />
					<p>
						{' '}
						Please enter the name of an employee or volunteer who supervised the
						pickup here:{' '}
					</p>
					<Form
						id="pickup_form"
						name="pickup_form"
						initialValues={{
							donatingSignOff: donatorContact,
						}}
						onFinish={onFinishDonating}
					>
						<Form.Item
							name="donatingSignOff"
							rules={[{ required: true, message: 'Please fill this out!' }]}
						>
							<Input style={{ width: '91vw' }} />
						</Form.Item>
					</Form>
				</div>
			),
		},
		{
			title: 'Food Log',
			content: (
				<>
					<h3>
						{' '}
						Please enter the type of food and number of pounds for each item
						that you picked up:
					</h3>
					<Form
						form={itemsForm}
						id="food_log_form"
						name="food_log_form"
						onFinish={onFinishFoodLog}
						initialValues={{ names: [{ item_name: '', pounds: '' }] }}
					>
						<Form.List name="names">
							{(fields, { add, remove }) => {
								return (
									<div>
										{fields.map((field, index) => (
											<Row key={field.key}>
												<Col span={11}>
													<Form.Item
														name={[field.name, 'item_name']}
														fieldKey={[field.fieldKey, 'itemName']}
														rules={[
															{
																required: true,
																message: 'Please enter the item name',
															},
														]}
													>
														<Input placeholder=" Item Name" />
													</Form.Item>
												</Col>
												<Col span={1}></Col>
												<Col span={11}>
													<Form.Item //need to figure out number validation here
														name={[field.name, 'pounds']}
														fieldKey={[field.fieldKey, 'pounds']}
														rules={[
															{
																required: true,
																message: 'Please enter the number of pounds',
															},
														]}
													>
														<Input placeholder="Pounds" />
													</Form.Item>
												</Col>
												<Col span={1}>
													<div
														style={{
															display: 'flex',
															justifyContent: 'center',
															marginTop: 8,
														}}
													>
														{fields.length > 1 ? (
															<MinusCircleOutlined
																className="dynamic-delete-button"
																onClick={() => {
																	remove(field.name);
																}}
															/>
														) : null}
													</div>
												</Col>
											</Row>
										))}
										<Form.Item>
											<Button
												type="dashed"
												onClick={() => {
													add();
												}}
												style={{ width: '100%' }}
											>
												<PlusOutlined /> Add Item
											</Button>
										</Form.Item>
									</div>
								);
							}}
						</Form.List>
					</Form>
				</>
			),
		},
		{
			title: 'Delivery',
			content: (
				<div>
					<h3> Please deliver the donation to:</h3>
					<Card title={receiverInfo.name} style={{ width: '91vw' }}>
						<p> Primary Contact: {' ' + receiverInfo.contact_person} </p>

						<div
							style={{
								marginBottom: '1em',
								display: 'flex',
								flexDirection: 'row',
							}}
						>
							<p style={{ marginBottom: 0, marginRight: 3 }}>Phone Number:</p>
							<a href={'tel:+' + receiverInfo.phone_number}>
								{receiverInfo.phone_number}
							</a>
						</div>
						<a
							href={formGoogleMapsURL(receiverInfo.address)}
							target="_blank"
							rel="noopener noreferrer"
						>
							{receiverInfo.address}
						</a>
					</Card>
					<br />
					<p>
						{' '}
						Please enter the name of an employee or volunteer who recieved the
						delivery here:{' '}
					</p>
					<Form
						id="delivery_form"
						name="delivery_form"
						initialValues={{
							receivingSignOff: receiverContact,
						}}
						onFinish={onFinishDelivery}
					>
						<Form.Item
							name="receivingSignOff"
							rules={[{ required: true, message: 'Please fill this out!' }]}
						>
							<Input
								onChange={(e) => {
									setReceiverContact(e.target.value);
								}}
								style={{ width: '91vw' }}
							/>
						</Form.Item>
					</Form>
				</div>
			),
		},
	];

	return (
		<Layout style={{ height: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
			<Layout.Header>
				<h1>Meal Matchup</h1>
			</Layout.Header>
			<Layout.Content style={{ background: 'white', padding: '1em' }}>
				<Row gutter={16}>
					<Col span={24}>
						<h1>Delivery on {moment(date).format('MMMM D, YYYY')}</h1>
						<br />
						<div>
							<Steps current={current}>
								{steps.map((item) => (
									<Step key={item.title} title={item.title} />
								))}
							</Steps>
							<div className="steps-content">{steps[current].content}</div>
							<div className="steps-action">
								{current === steps.length - 3 && (
									<Button
										type="primary"
										form="pickup_form"
										style={{ marginLeft: 7 }}
										htmlType="submit"
									>
										Next
									</Button>
								)}
								{current === steps.length - 2 && (
									<Button
										type="primary"
										form="food_log_form"
										style={{ marginLeft: 7 }}
										htmlType="submit"
									>
										Next
									</Button>
								)}
								{current === steps.length - 1 && (
									<Button
										form="delivery_form"
										style={{ marginLeft: 7 }}
										htmlType="submit"
										type="primary"
									>
										Submit
									</Button>
								)}
								{current > 0 && (
									<Button
										style={{ margin: '0 8px' }}
										onClick={() => setCurrent(current - 1)}
									>
										Previous
									</Button>
								)}
							</div>
						</div>
					</Col>
				</Row>
			</Layout.Content>
		</Layout>
	);
}

Delivery.propTypes = {
	date: PropTypes.object.isRequired,
	donatorInfo: PropTypes.shape({
		name: PropTypes.string.isRequired,
		address: PropTypes.string.isRequired,
		contact_person: PropTypes.string.isRequired,
		phone_number: PropTypes.string.isRequired,
	}).isRequired,
	receiverInfo: PropTypes.shape({
		name: PropTypes.string.isRequired,
		address: PropTypes.string.isRequired,
		contact_person: PropTypes.string.isRequired,
		phone_number: PropTypes.string.isRequired,
	}).isRequired,
	requestID: PropTypes.string.isRequired,
};

export default Delivery;
