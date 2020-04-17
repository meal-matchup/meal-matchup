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
} from 'antd';

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
								})
								.then((newAgencyDoc) => {
									return firebase
										.firestore()
										.collection('users')
										.doc(result.user.uid)
										.set({
											umbrella: umbrella,
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
