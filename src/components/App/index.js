import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import debug from 'debug';
import { Link } from 'gatsby';
import firebase from 'gatsby-plugin-firebase';
import {
	Avatar,
	Layout,
	Menu,
	Modal,
	Form,
	Select,
	Tooltip,
	Radio,
	Button,
	Input,
	Spin,
} from 'antd';
import { CalendarOutlined, ContactsOutlined } from '@ant-design/icons';
import { AgencyTypes } from './Enums';

import * as AppPages from './AppPages';
import Auth from '../Auth';
import { Logo } from '../../graphics/graphics';

const { Sider, Header, Content, Footer } = Layout;

function App({ authRequired = true, pageId, children }) {
	const [loading, setLoading] = useState(true);

	const [loadingUmbrella, setLoadingUmbrella] = useState(true);
	const [loadingAgency, setLoadingAgency] = useState(true);
	const [loadingAgencies, setLoadingAgencies] = useState(true);

	const [user, setUser] = useState(null);
	const [umbrella, setUmbrella] = useState(null);
	const [agency, setAgency] = useState(null);
	const [agencies, setAgencies] = useState(null);

	const [createAgencyForm] = Form.useForm();
	const [creatingNewAgency, setCreatingNewAgency] = useState(false);
	const [agencyType, setAgencyType] = useState(null);

	const [startAgencyForm] = Form.useForm();
	const [beginningSettingAgency, setBeginningSettingAgency] = useState(false);

	const beginSettingAgency = (values) => {
		setBeginningSettingAgency(true);

		const { type, name } = values.agency;
		setAgencyType(type);

		if (name === 'new') {
			setCreatingNewAgency(true);
		} else {
			// Set the agency from an existing
			return firebase
				.firestore()
				.collection('users')
				.doc(user.uid)
				.update({
					agency: firebase.firestore().collection('agencies').doc(name),
				})
				.then(() => {
					const theNewAgency = agencies.filter((x) => x.id === name)[0];
					setAgency(theNewAgency);
				});
		}
	};

	useEffect(() => {
		if (!loadingUmbrella && !loadingAgency && !loadingAgencies)
			setLoading(false);
	}, [loadingUmbrella, loadingAgency, loadingAgencies, loading]);

	useEffect(() => {
		if (!firebase || agencies !== null || !umbrella) return;

		let mounted = true;

		const getAgencies = () =>
			firebase
				.firestore()
				.collection('agencies')
				.where('umbrella', '==', umbrella.id)
				.get()
				.then((querySnapshot) => {
					const allAgencies = [];
					querySnapshot.forEach((agencyDoc) => {
						allAgencies.push({
							id: agencyDoc.id,
							name: agencyDoc.data().name,
							type: agencyDoc.data().type,
						});
					});
					if (mounted) {
						setAgencies(allAgencies);
						setLoadingAgencies(false);
					}
				});
		getAgencies();

		return () => {
			mounted = false;
		};
	}, [agencies, umbrella, loadingAgencies]);

	const createAgency = async (values) => {
		const { name } = values.new;

		const agencyData = {
			name,
			type: agencyType,
			members: [user.uid],
			admins: [user.uid],
			umbrella: umbrella.id,
		};

		await firebase
			.firestore()
			.collection('agencies')
			.add(agencyData)
			.then((doc) => {
				setAgency({
					id: doc.id,
					type: agencyType,
					name,
				});
				return firebase
					.firestore()
					.collection('users')
					.doc(user.uid)
					.update({
						agency: firebase.firestore().doc(`/agencies/${doc.id}`),
					});
			});
	};

	useEffect(() => {
		if (!firebase) return;

		return firebase.auth().onAuthStateChanged((newUser) => {
			// Set user to null when logged out
			if (!newUser) {
				localStorage.setItem('logged-in', 'false');
				setLoadingUmbrella(false);
				return setUser(newUser);
			}

			if (localStorage.getItem('logged-in') === 'true' && umbrella) {
				if (user !== newUser) setUser(newUser);
				setLoadingUmbrella(false);
				return;
			}

			// Otherwise, check if they've been created in the DB before setting user
			return firebase
				.firestore()
				.collection('users')
				.doc(newUser.uid)
				.get()
				.then((doc) => {
					if (doc.exists) {
						localStorage.setItem('logged-in', 'true');
						setUser(newUser);
						if (doc.data().agency) {
							doc
								.data()
								.agency.get()
								.then((agencyDoc) => {
									if (agencyDoc.exists) {
										debug('Setting agency');
										setAgency({
											id: agencyDoc.id,
											type: agencyDoc.data().type,
											name: agencyDoc.data().name,
										});
									}
								});
						}
						setLoadingAgency(false);
						if (doc.data().umbrella) {
							doc
								.data()
								.umbrella.get()
								.then((umbrellaDoc) => {
									if (umbrellaDoc.exists) {
										debug('Setting umbrella');
										setUmbrella({
											id: umbrellaDoc.id,
											name: umbrellaDoc.data().name,
										});
										setLoadingUmbrella(false);
									}
								});
						}
						localStorage.setItem('logged-in', 'true');
					} else {
						setUser(null);
					}
				})
				.catch((e) => {
					debug('Error getting document', e);
				});
		});
	}, [user, agency, loadingAgency, umbrella, loadingUmbrella]);

	const logOut = () => firebase.auth().signOut();

	return (
		<Layout className={`app-layout ${!user ? 'auth-page' : ''}`}>
			<div className="loading" data-visible={loading}>
				<Spin size="large" />
			</div>
			{user && (
				<Sider
					className="app-sider"
					breakpoint="lg"
					collapsedWidth="0"
					width="300"
				>
					<div className="logo-container">
						<Logo color="#fff" />
					</div>

					<Menu
						className="sider-menu"
						selectedKeys={[pageId]}
						mode="inline"
						theme="dark"
					>
						<Menu.Item key={AppPages.Calendar} className="sider-link">
							<Link to="/app/">
								<CalendarOutlined />
								Calendar
							</Link>
						</Menu.Item>

						<Menu.Item key={AppPages.Directory} className="sider-link">
							<Link to="/app/directory">
								<ContactsOutlined />
								Directory
							</Link>
						</Menu.Item>
					</Menu>
				</Sider>
			)}

			<Layout className="app-inner-layout">
				<Header className="app-header">
					{!user && (
						<div className="logo-container">
							<Logo />
						</div>
					)}
					{user && (
						<>
							<div className="page-title-container">
								<h1>{pageId}</h1>
							</div>

							<Menu
								className="app-menu"
								mode="horizontal"
								selectedKeys={[pageId]}
							>
								<Menu.Item key={AppPages.Account} className="menu-link">
									<Link to="/app/account">
										<Avatar className="menu-avatar" src={user.photoURL} />
										{user.displayName ? user.displayName : AppPages.Account}
									</Link>
								</Menu.Item>

								<Menu.Item className="menu-link" onClick={logOut}>
									Log Out
								</Menu.Item>
							</Menu>
						</>
					)}
				</Header>

				<Content className={`app-content ${user ? 'has-sider' : ''}`}>
					<Modal
						visible={authRequired && user && !agency}
						title="Please join or create an agency"
						footer={null}
						centered
					>
						<p>
							To get started with Meal Matchup, please join or create an agency.
						</p>

						<Form
							layout="vertical"
							form={startAgencyForm}
							onFinish={beginSettingAgency}
						>
							<Form.Item
								label="Agency type"
								name={['agency', 'type']}
								rules={[
									{
										required: true,
										message: 'Please select an agency type',
									},
								]}
							>
								<Radio.Group
									label="Agency type"
									buttonStyle="solid"
									style={{ width: '100%' }}
									disabled={beginningSettingAgency}
									onChange={(e) => setAgencyType(e.target.value)}
								>
									<Radio.Button value={AgencyTypes.DONATOR}>
										<Tooltip title="Donating Agencies donate food">
											Donating Agency
										</Tooltip>
									</Radio.Button>

									<Radio.Button value={AgencyTypes.RECEIVER}>
										<Tooltip title="Receiving Agencies receive donations">
											Receiving Agency
										</Tooltip>
									</Radio.Button>

									<Radio.Button value={AgencyTypes.DELIVERER}>
										<Tooltip title="Delivering Agencies deliver donations">
											Delivering Agency
										</Tooltip>
									</Radio.Button>
								</Radio.Group>
							</Form.Item>

							<Form.Item
								name={['agency', 'name']}
								label="Agency"
								rules={[
									{
										required: true,
										message: 'Please select an option',
									},
								]}
							>
								<Select disabled={creatingNewAgency || !agencyType}>
									{agencies &&
										agencies.map((anAgency) => {
											if (anAgency.type === agencyType) {
												return (
													<Select.Option key={anAgency.id} value={anAgency.id}>
														{anAgency.name}
													</Select.Option>
												);
											}
										})}
									<Select.Option value="new">Create new agency</Select.Option>
								</Select>
							</Form.Item>

							<Form.Item>
								<Button
									disabled={beginningSettingAgency}
									type="primary"
									htmlType="submit"
								>
									Continue
								</Button>
							</Form.Item>
						</Form>

						{creatingNewAgency && (
							<>
								<h2>Agency Details</h2>

								<Form
									layout="vertical"
									form={createAgencyForm}
									onFinish={createAgency}
								>
									<Form.Item
										name={['new', 'name']}
										label="Name"
										extra={`This agency will be created under the ${umbrella.name}.`}
									>
										<Input />
									</Form.Item>

									<Form.Item>
										<Button type="primary" htmlType="submit">
											Create
										</Button>
									</Form.Item>
								</Form>
							</>
						)}
					</Modal>
					{authRequired && !user ? <Auth /> : children}
				</Content>

				<Footer className="app-footer">© 2020 Meal Matchup</Footer>
			</Layout>
		</Layout>
	);
}

App.propTypes = {
	authRequired: PropTypes.bool,
	pageId: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

export default App;

export { AppPages, AgencyTypes };
