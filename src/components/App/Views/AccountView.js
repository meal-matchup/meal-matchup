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

import { AgencyTypes } from '../Enums';

function AccountView({ user, umbrella, agency }) {
	const agencyTypes = {
		[AgencyTypes.DONATOR]: 'Donating Agency',
		[AgencyTypes.RECEIVER]: 'Receiving Agency',
		[AgencyTypes.DELIVERER]: 'Delivering Agency',
	};

	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);

	function onFinish() {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setEdit(false);
		}, 3000);
	}

	function addNewUsers(users) {
		const updated_users = this.props.agency.users.concat(users);
		return firebase
			.firestore()
			.collection('agencies')
			.doc(this.props.agency.id)
			.update({
				users: updated_users,
			})
			.catch((e) => {
				debug("unable to add new users to agency", e);
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
							id="dynamic_form_item"
							name="dynamic_form_item"
							onFinish={onFinish}
						>
							<Form.List name="names">
								{(fields, { add, remove }) => {
									return (
										<div>
											{agency.users.map((field) => (
												<Row key={field.key}>
													<Col span={11}>
														<Form.Item
															name={[field.name, 'name']}
															fieldKey={[field.fieldKey, 'name']}
															rules={[
																{
																	required: true,
																	message: 'Please enter a name',
																},
															]}
														>
															<Input
																defaultValue={field.name}
																placeholder="Name"
															/>
														</Form.Item>
													</Col>
													<Col span={1}></Col>
													<Col span={11}>
														<Form.Item
															name={[field.name, 'email']}
															fieldKey={[field.fieldKey, 'email']}
															rules={[
																{
																	required: true,
																	type: 'email',
																	message: 'Please enter an email address',
																},
															]}
														>
															<Input
																defaultValue={field.email}
																placeholder="Email"
															/>
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
													<PlusOutlined /> Add Deliverers
												</Button>
											</Form.Item>
										</div>
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
										console.log(edit);
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
