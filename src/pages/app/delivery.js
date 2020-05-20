import React, { useEffect, useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import firebase from 'gatsby-plugin-firebase';
import { AgencyTypes } from '../../components/App/Enums';
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

function Delivery({ date, receiverInfo, donatorInfo }) {
	function formGoogleMapsURL(address) {
		// Uncomment if you want to give this an agency object and change address to agency above
		//let address = agency.address.line1;
		//if (agency.address.line2) address += ` ${agency.address.line2}`;
		//address += `, ${agency.address.city}, ${agency.address.state} ${agency.address.zip}`;
		return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
			address
		)}`;
	}

	const onFinish = (values) => {
		console.log('Success:', values);
	};

	const { Step } = Steps;
	const [current, setCurrent] = useState(0);

	const steps = [
		{
			title: 'Pick Up',
			content: (
				<div>
					<h3> Please pick up the donation from:</h3>
					<Card title={donatorInfo.name} style={{ width: '93vw' }}>
						<p> Primary Contact: {" " + donatorInfo.contact_person} </p>

						<div
							style={{
								marginBottom: '1em',
								display: 'flex',
								flexDirection: 'row',
							}}
						>
							<p style={{ marginBottom: 0, marginRight: 3 }}>Phone Number:</p>
							<a href={'tel:+' + donatorInfo.phone_number}>{donatorInfo.phone_number}</a>
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
					<p> Please have an employee sign off here: </p>
					<Form
						id="pickup_form"
						name="pickup_form"
						initialValues={{ remember: true }}
						onFinish={onFinish}
					>
						<Form.Item
							name="donatingSignOff"
							rules={[{ required: true, message: 'Please fill this out!' }]}
						>
							<Input />
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
						Please enter the name and number of pounds for each item that you
						picked up:
					</h3>
					<Form id="food_log_form" name="food_log_form" onFinish={onFinish}>
						<Form.List name="names">
							{(fields, { add, remove }) => {
								return (
									<div>
										{fields.map((field) => (
											<Row key={field.key}>
												<Col span={11}>
													<Form.Item
														name={[field.name, 'Item Name']}
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
														<MinusCircleOutlined
															className="dynamic-delete-button"
															onClick={() => {
																remove(field.name);
															}}
														/>
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
					<Card title={receiverInfo.name} style={{ width: '93vw' }}>
						<p> Primary Contact: {" " + receiverInfo.contact_person} </p>

						<div
							style={{
								marginBottom: '1em',
								display: 'flex',
								flexDirection: 'row',
							}}
						>
							<p style={{ marginBottom: 0, marginRight: 3 }}>Phone Number:</p>
							<a href={'tel:+' + receiverInfo.phone_number}>{receiverInfo.phone_number}</a>
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
					<p> Please have an employee sign off here: </p>
					<Form
						id="delivery_form"
						name="delivery_form"
						initialValues={{ remember: true }}
						onFinish={onFinish}
					>
						<Form.Item
							name="recievingSignOff"
							rules={[{ required: true, message: 'Please fill this out!' }]}
						>
							<Input />
						</Form.Item>
					</Form>
				</div>
			),
		},
	];

	return (
		<Layout style={{ height: '100%' }}>
			<Layout.Header theme="dark">
				<h1>Meal Matchup</h1>
			</Layout.Header>
			<Layout.Content style={{ background: 'white', padding: '1em' }}>
				<Row gutter={16}>
					<Col span={24}>
						<h1>Delivery on {moment(date).format('MMMM D, YYYY')}</h1>
						<Divider />
						<div>
							<Steps current={current}>
								{steps.map((item) => (
									<Step key={item.title} title={item.title} />
								))}
							</Steps>
							<div className="steps-content">{steps[current].content}</div>
							<br />
							<div className="steps-action">
								{current === steps.length - 3 && (
									<Button
										type="primary"
										onClick={() => setCurrent(current + 1)}
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
										onClick={() => setCurrent(current + 1)}
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
										onClick={() => message.success('Delivery Complete!')}
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
	}),
	receiverInfo: PropTypes.shape({
		name: PropTypes.string.isRequired,
		address: PropTypes.string.isRequired,
		contact_person: PropTypes.string.isRequired,
		phone_number: PropTypes.string.isRequired,
	}),
};

export default Delivery;
