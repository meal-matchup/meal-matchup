import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import firebase from 'gatsby-plugin-firebase';
import {
	Descriptions,
	Tooltip,
	Button,
	Modal,
	Form,
	Row,
	Col,
	message,
	Input,
} from 'antd';
import {
	CheckCircleTwoTone,
	ClockCircleTwoTone,
	PlusOutlined,
	MinusCircleOutlined,
} from '@ant-design/icons';

import debug from 'debug';

import { AgencyTypes } from '../Enums';

function AccountView({ user, umbrella, agency }) {
	const agencyTypes = {
		[AgencyTypes.DONATOR]: 'Donating Agency',
		[AgencyTypes.RECEIVER]: 'Receiving Agency',
		[AgencyTypes.DELIVERER]: 'Delivering Agency',
	};

	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const rules = [{ required: true }];

	const [deliverersForm] = Form.useForm();

	const initialUsers = (agency && agency.users) || [];
	const [users, setUsers] = useState([...initialUsers]);

	const [initialValues, setInitialValues] = useState({});

	useEffect(() => {
		const initialUsers = (agency && agency.users) || [];
		setUsers([...initialUsers]);
	}, [agency]);

	useEffect(() => {
		function getFieldValues() {
			const theValues = {};
			users.forEach((user, index) => {
				if (user) {
					theValues[`user${index}`] = {
						name: user.name,
						email: user.email,
					};
				}
			});
			return theValues;
		}

		setInitialValues(getFieldValues());
	}, [users]);

	useEffect(() => {
		deliverersForm.setFieldsValue(initialValues);
	}, [deliverersForm, initialValues]);

	const submitForm = (values) => {
		setLoading(true);
		let newUsers = {}
		if(values['deliverers']){
			newUsers = users.concat(values['deliverers']);
		} else {
			newUsers = users;
		}
		setUsers(newUsers);
		addNewUsers(newUsers);
		setLoading(false);
		setEdit(false);
	};

	function addNewUsers(newUsers) {
		return firebase
			.firestore()
			.collection('agencies')
			.doc(agency.id)
			.update({
				users: newUsers,
			})
			.catch((e) => {
				debug('unable to add new users to agency', e);
				message.error('Could not edit request');
			});
	}

	return (
		<>
			{user && umbrella && agency && (
				<>
					<Modal
						visible={edit}
						title="Edit Deliverers"
						onCancel={() => {
							setEdit(false);
						}}
						footer={[
							<Button
								key="back"
								onClick={() => {
									setEdit(false);
								}}
							>
								Cancel
							</Button>,
							<Button
								form="dynamic_form_item"
								htmlType="submit"
								key="save"
								type="primary"
								loading={loading}
							>
								Save
							</Button>,
						]}
					>
						<Form
							form={deliverersForm}
							id="dynamic_form_item"
							onFinish={submitForm}
							initialValues={{
								user0: {
									name: 'hi',
								},
							}}
						>
							{users.map((user, index) => (
								<Row key={`user${index}`} gutter={6}>
									<Col span={11}>
										<Form.Item name={[`user${index}`, 'name']} rules={rules}>
											<Input placeholder="Name" />
										</Form.Item>
									</Col>
									<Col span={11}>
										<Form.Item name={[`user${index}`, 'email']} rules={rules}>
											<Input placeholder="Email" />
										</Form.Item>
									</Col>
									<Col span={2}>
										<Form.Item>
											<Button
												type="link"
												onClick={() => {
													const newUsers = [...users];
													newUsers.splice(index, 1);
													setUsers([...newUsers]);
												}}
												style={{ width: '100%' }}
											>
												<MinusCircleOutlined />
											</Button>
										</Form.Item>
									</Col>
								</Row>
							))}

							<Form.List name="deliverers">
								{(fields, { add, remove }) => {
									return (
										<>
											{fields.map((field, index) => (
												<Row key={field.key} gutter={6}>
													<Col span={11}>
														<Form.Item
															name={[field.name, 'name']}
															fieldKey={[field.fieldKey, 'name']}
															rules={rules}
														>
															<Input placeholder="Name" />
														</Form.Item>
													</Col>
													<Col span={11}>
														<Form.Item
															name={[field.name, 'email']}
															fieldKey={[field.fieldKey, 'email']}
															rules={rules}
														>
															<Input placeholder="Email" />
														</Form.Item>
													</Col>
													<Col span={2}>
														<Form.Item>
															<Button
																type="link"
																onClick={() => {
																	remove(field.name);
																}}
																style={{ width: '100%' }}
															>
																<MinusCircleOutlined />
															</Button>
														</Form.Item>
													</Col>
												</Row>
											))}

											<Form.Item>
												<Button
													type="dashed"
													style={{ width: '100%' }}
													onClick={() => {
														add();
													}}
												>
													<PlusOutlined /> Add Deliverer
												</Button>
											</Form.Item>
										</>
									);
								}}
							</Form.List>
						</Form>
					</Modal>
					<Descriptions column={1} bordered>
						<Descriptions.Item label="Name">
							{user.displayName}
						</Descriptions.Item>
						<Descriptions.Item label="Email address">
							{user.email}
							{!!user.emailVerified && (
								<CheckCircleTwoTone
									twoToneColor="#52c41a"
									style={{ marginLeft: '.5em' }}
								/>
							)}
						</Descriptions.Item>
						<Descriptions.Item label="Umbrella">
							{umbrella.name}
						</Descriptions.Item>
						<Descriptions.Item label="Agency">
							{agency.name}
							{agency.approved ? (
								<Tooltip title="Your agency has been approved">
									<CheckCircleTwoTone
										twoToneColor="#52c41a"
										style={{ marginLeft: '.5em' }}
									/>
								</Tooltip>
							) : (
								<Tooltip title="Your agency is pending approval">
									<ClockCircleTwoTone style={{ marginLeft: '.5em' }} />
								</Tooltip>
							)}
						</Descriptions.Item>
						<Descriptions.Item label="Agency type">
							{agencyTypes[agency.type]}
						</Descriptions.Item>
						{agency.users && (
							<Descriptions.Item label="Agency Deliverers">
								{agency.users.map((person) => (
									<div key={person.name}>
										{person.name}, {person.email}
									</div>
								))}
								<Button
									type="link"
									onClick={() => {
										setEdit(true);
									}}
								>
									Edit Deliverers
								</Button>
							</Descriptions.Item>
						)}
						<Descriptions.Item label="Agency address">
							{agency.address.line1}
							<br />
							{agency.address.line2 && agency.address.line2}
							{agency.address.line2 && <br />}
							{agency.address.city}, {agency.address.state} {agency.address.zip}
						</Descriptions.Item>
					</Descriptions>
				</>
			)}
		</>
	);
}

AccountView.propTypes = {
	user: PropTypes.shape({
		displayName: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		emailVerified: PropTypes.bool,
	}),
	umbrella: PropTypes.shape({
		name: PropTypes.string.isRequired,
		id: PropTypes.string,
	}),
	agency: PropTypes.shape({
		approved: PropTypes.bool.isRequired,
		name: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		address: PropTypes.shape({
			line1: PropTypes.string.isRequired,
			line2: PropTypes.string,
			city: PropTypes.string.isRequired,
			state: PropTypes.string.isRequired,
			zip: PropTypes.string.isRequired,
		}).isRequired,
	}),
};

export default AccountView;
