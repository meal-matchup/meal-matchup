import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import firebase from 'gatsby-plugin-firebase';
import debug from 'debug';
import {
	Button,
	Cascader,
	Divider,
	Form,
	Input,
	Layout,
	PageHeader,
	Select,
	Col,
	Row,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthPages } from '../Enums';
import { AgencyTypes } from '../../App';

function SignUpView({ changeView }) {
	const [umbrellas, setUmbrellas] = useState(null);
	const [umbrella, setUmbrella] = useState(null);
	const [agencies, setAgencies] = useState(null);
	const [agencyType, setAgencyType] = useState(null);
	const [agencyId, setAgencyId] = useState(null);

	const [donatingAgencies, setDonatingAgencies] = useState([]);
	const [receivingAgencies, setReceivingAgencies] = useState([]);
	const [deliveringAgencies, setDeliveringAgencies] = useState([]);

	const newAgencyItem = { value: 'new', label: 'New agency' };

	const updateAgency = (values) => {
		if (values.length == 2) {
			setAgencyType(values[0]);
			setAgencyId(values[1]);
		} else {
			setAgencyType(null);
			setAgencyId(null);
		}
	};

	useEffect(() => {
		if (umbrella && agencies) {
			const filterAgencies = (type, callback) => {
				const filteredAgencies = [];
				agencies.forEach((anAgency) => {
					if (
						anAgency.umbrella === umbrella.id &&
						anAgency.type === AgencyTypes[type]
					) {
						filteredAgencies.push({
							value: anAgency.id,
							label: anAgency.name,
						});
					}
				});
				callback(filteredAgencies);
			};

			filterAgencies(AgencyTypes.DONATOR, setDonatingAgencies);
			filterAgencies(AgencyTypes.RECEIVER, setReceivingAgencies);
			filterAgencies(AgencyTypes.DELIVERER, setDeliveringAgencies);
		}
	}, [umbrella, agencies]);

	useEffect(() => {
		if (!firebase) return;

		let mounted = true;

		const getData = (type, callback) => {
			firebase
				.firestore()
				.collection(type)
				.get()
				.then((querySnapshot) => {
					const allDocs = [];
					querySnapshot.forEach((doc) => {
						const docData = {
							id: doc.id,
							name: doc.data().name,
						};

						if (type === 'agencies') {
							docData['type'] = doc.data().type;
							docData['umbrella'] = doc.data().umbrella;
						}

						allDocs.push(docData);
					});
					if (mounted) callback(allDocs);
				})
				.catch((error) => {
					debug('Could not get data', type, error);
				});
		};

		if (!umbrellas) {
			getData('umbrellas', setUmbrellas);
		}

		if (!agencies) {
			getData('agencies', setAgencies);
		}
	}, [umbrellas, agencies]);

	const [signUpForm] = Form.useForm();
	const [signingUp, setSigningUp] = useState(false);
	const [signingUpGenericStatus, setSigningUpGenericStatus] = useState(null);
	const [signingUpEmailStatus, setSigningUpEmailStatus] = useState(null);
	const [signingUpConfirmStatus, setSigningUpConfirmStatus] = useState(null);
	const [signingUpPassword, setSigningUpPassword] = useState('');
	const [signingUpAgencyStatus, setSigningUpAgencyStatus] = useState(null);

	const signUp = (values) => {
		setSigningUp(true);
		setSigningUpGenericStatus('validating');
		setSigningUpEmailStatus('validating');
		setSigningUpConfirmStatus('validating');

		const { name, email, password, confirm } = values.signup;

		// Only continue if agency is set
		if (!agencyType || !agencyId) {
			setSigningUpAgencyStatus('error');
			return;
		}

		// Only continue if, when creating a new agency, it has a name
		if (agencyId === 'new' && !values.signup.agencyName) {
			return;
		}

		if (password !== confirm) {
			setSigningUpGenericStatus(null);
			setSigningUpEmailStatus(null);
			setSigningUpConfirmStatus('error');
			return;
		}

		return firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((result) => {
				return result.user
					.updateProfile({
						displayName: name,
					})
					.then(() => {
						if (agencyId === 'new') {
							return firebase
								.firestore()
								.collection('agencies')
								.add({
									name: values.signup.agencyName,
									type: agencyType,
									umbrella: umbrella.id,
									members: {
										[result.user.uid]: true,
									},
									admins: {
										[result.user.uid]: true,
									},
									approved: false,
									address: {
										line1: values.signup.agencyAddressLine1,
										line2: values.signup.agencyAddressLine2 || '',
										city: values.signup.agencyAddressCity,
										state: values.signup.agencyAddressState,
										zip: values.signup.agencyAddressZip,
									},
									contact: {
										name: values.signup.agencyContactName,
										email: values.signup.agencyContactEmail,
										phone: values.signup.agencyContactPhone,
									},
									users: values.users || null,
								})
								.then((newAgencyDoc) => {
									return firebase
										.firestore()
										.collection('users')
										.doc(result.user.uid)
										.set({
											umbrella: umbrella.id,
											agency: newAgencyDoc.id,
										})
										.catch((error) => {
											debug('Could not add umbrella and agency to user', error);
										});
								})
								.catch((error) => {
									debug('Could not create agency', error);
								});
						} else {
							return firebase
								.firestore()
								.collection('agencies')
								.doc(agencyId)
								.update({
									[`members.${result.user.uid}`]: true,
								})
								.then(() => {
									return firebase
										.firestore()
										.collection('users')
										.doc(result.user.uid)
										.set({
											umbrella: umbrella.id,
											agency: agencyId,
										})
										.catch((error) => {
											debug('Could not add umbrella and agency to user', error);
										});
								})
								.catch((error) => {
									debug('Could not join agency', error);
								});
						}
					})
					.catch((error) => {
						debug('Could not update user display name', error);
					});
			})
			.catch((error) => {
				debug('Could not create user', error);
			});
	};

	return (
		<Layout style={{ backgroundColor: 'transparent' }}>
			<PageHeader
				title={AuthPages.SIGNUP.title}
				style={{ marginBottom: '1em', padding: 0 }}
			/>

			<Layout.Content>
				<Form form={signUpForm} layout="vertical" onFinish={signUp}>
					<Form.Item
						name={['signup', 'name']}
						label="Name"
						rules={[
							{
								required: true,
								message: 'Please enter your name',
							},
						]}
						hasFeedback
						validateStatus={signingUpGenericStatus}
					>
						<Input disabled={signingUp} type="text" />
					</Form.Item>

					<Form.Item
						name={['signup', 'email']}
						label="Email address"
						rules={[
							{
								required: true,
								type: 'email',
								message: 'Please enter your email address',
							},
						]}
						hasFeedback
						validateStatus={signingUpEmailStatus}
					>
						<Input disabled={signingUp} type="email" />
					</Form.Item>

					<Form.Item
						name={['signup', 'password']}
						label="Password"
						rules={[
							{
								required: true,
								message: 'Please enter a password',
							},
						]}
						hasFeedback
						validateStatus={signingUpGenericStatus}
					>
						<Input
							disabled={signingUp}
							type="password"
							onChange={(e) => setSigningUpPassword(e.target.value)}
						/>
					</Form.Item>

					<Form.Item
						name={['signup', 'confirm']}
						label="Confirm password"
						rules={[
							{
								required: true,
								message: 'Please confirm your password',
							},
							{
								validator: (_, value) =>
									value && signingUpPassword === value
										? Promise.resolve()
										: Promise.reject('Your passwords do not match'),
							},
						]}
						hasFeedback
						validateStatus={signingUpConfirmStatus}
					>
						<Input disabled={signingUp} type="password" />
					</Form.Item>

					<Form.Item
						name={['signup', 'umbrella']}
						label="Umbrella organization"
						extra="Dont see your organization? Email us!"
						rules={[
							{
								required: true,
								message: 'Please select an Umbrella organization',
							},
						]}
					>
						<Select
							disabled={signingUp}
							onChange={(id) =>
								setUmbrella(umbrellas.filter((x) => x.id === id)[0])
							}
						>
							{umbrellas &&
								umbrellas.map((umbrella) => (
									<Select.Option key={umbrella.id}>
										{umbrella.name}
									</Select.Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item
						name={['signup', 'agency']}
						rules={[
							{
								required: true,
								message: 'Please select an agency',
							},
						]}
						hasFeedback
						validateStatus={signingUpAgencyStatus}
					>
						<Cascader
							disabled={!umbrella || signingUp}
							onChange={updateAgency}
							options={[
								{
									value: AgencyTypes.DONATOR,
									label: 'Donating Agency',
									children: [...donatingAgencies, newAgencyItem],
								},
								{
									value: AgencyTypes.RECEIVER,
									label: 'Receiving Agency',
									children: [...receivingAgencies, newAgencyItem],
								},

								{
									value: AgencyTypes.DELIVERER,
									label: 'Delivering Agency',
									children: [...deliveringAgencies, newAgencyItem],
								},
							]}
						/>
					</Form.Item>

					{umbrella && agencyType && agencyId === 'new' && (
						<>
							<Form.Item
								name={['signup', 'agencyName']}
								label="Agency Name"
								rules={[
									{
										required: true,
										message: 'Please enter the name of your agency',
									},
								]}
								hasFeedback
							>
								<Input disabled={signingUp} type="text" />
							</Form.Item>

							<Form.Item
								name={['signup', 'agencyContactName']}
								label="Point of Contact name"
								extra={`This will be visible to all ${umbrella.name} users.`}
								rules={[
									{
										required: true,
										message: 'Please enter the contact name for your agency',
									},
								]}
							>
								<Input disabled={signingUp} type="text" />
							</Form.Item>

							<Form.Item
								name={['signup', 'agencyContactEmail']}
								label="Point of Contact email address"
								extra={`This will be visible to all ${umbrella.name} users.`}
								rules={[
									{
										required: true,
										type: 'email',
										message: 'Please enter the contact email for your agency',
									},
								]}
							>
								<Input disabled={signingUp} type="email" />
							</Form.Item>

							<Form.Item
								name={['signup', 'agencyContactPhone']}
								label="Point of Contact phone number"
								extra={`This will be visible to all ${umbrella.name} users.`}
								rules={[
									{
										required: true,
										message: 'Please enter the contact phone for your agency',
									},
								]}
							>
								<Input disabled={signingUp} type="tel" />
							</Form.Item>
							{agencyType === AgencyTypes.DELIVERER && (
								<>
									<Form.List name="users" label="Deliverers">
										{(fields, { add, remove }) => {
											/**
											 * `fields` internal fill with `name`, `key`, `fieldKey` props.
											 * You can extends this into sub field to support multiple dynamic fields.
											 */
											return (
												<div>
													{fields.map((field) => (
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
																	<Input placeholder="Name" />
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
																	<Input placeholder="Email" />
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
													<Form.Item extra="These are the members in your organization who will be performing deliveries.">
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
								</>
							)}
							<Form.Item
								extra={`This will be visible to all ${umbrella.name} users.`}
							>
								<Form.Item
									name={['signup', 'agencyAddressLine1']}
									label="Street Address"
									rules={[
										{
											required: true,
											message: 'Please enter the address of your agency',
										},
									]}
									style={{ display: 'inline-block', width: 'calc(50% - 6px)' }}
								>
									<Input
										disabled={signingUp}
										placeholder="1 Fake Ave"
										type="text"
									/>
								</Form.Item>

								<Form.Item
									name={['signup', 'agencyAddressLine2']}
									label="Line 2"
									style={{
										display: 'inline-block',
										width: 'calc(50% - 6px)',
										margin: '0 0 0 12px',
									}}
								>
									<Input disabled={signingUp} placeholder="#123" type="text" />
								</Form.Item>
							</Form.Item>

							<Form.Item
								extra={`This will be visible to all ${umbrella.name} users.`}
							>
								<Form.Item
									name={['signup', 'agencyAddressCity']}
									label="City"
									rules={[
										{
											required: true,
											message: 'Please enter the city your agency is in',
										},
									]}
									style={{
										display: 'inline-block',
										width: 'calc((100% / 3) - 8px)',
									}}
								>
									<Input
										disabled={signingUp}
										placeholder="Seattle"
										type="text"
									/>
								</Form.Item>

								<Form.Item
									name={['signup', 'agencyAddressState']}
									label="State"
									rules={[
										{
											required: true,
											message: 'Please enter the state your agency is in',
										},
									]}
									style={{
										display: 'inline-block',
										width: 'calc((100% / 3) - 8px)',
										margin: '0 12px',
									}}
								>
									<Input disabled={signingUp} placeholder="WA" type="text" />
								</Form.Item>

								<Form.Item
									name={['signup', 'agencyAddressZip']}
									label="Zip"
									rules={[
										{
											required: true,
											message: 'Please enter the zip code your agency is in',
										},
									]}
									style={{
										display: 'inline-block',
										width: 'calc((100% / 3) - 8px)',
									}}
								>
									<Input disabled={signingUp} placeholder="98102" type="text" />
								</Form.Item>
							</Form.Item>
						</>
					)}

					<Form.Item>
						<Button disabled={signingUp} type="primary" htmlType="submit">
							Continue
						</Button>
					</Form.Item>
				</Form>

				<Divider />

				<p>
					Already have an account?
					<Button type="link" onClick={() => changeView(AuthPages.LOGIN)}>
						Log in now!
					</Button>
				</p>
			</Layout.Content>
		</Layout>
	);
}

SignUpView.propTypes = {
	changeView: PropTypes.func.isRequired,
};

export default SignUpView;
