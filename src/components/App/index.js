import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import firebase from 'gatsby-plugin-firebase';
import debug from 'debug';

import { Layout, Menu, PageHeader } from 'antd';

import Loading from './Loading';
import { AppPages, AgencyTypes, SiderPages } from './Enums';
import { AccountView, CalendarView, DirectoryView } from './Views';

import Auth from '../Auth';

import { Logo } from '../../graphics/graphics';

function App() {
	// true if the app is still loading
	const [loading, setLoading] = useState(true);

	// outline everything that needs to load!
	const [userLoading, setUserLoading] = useState(true);
	const [umbrellaLoading, setUmbrellaLoading] = useState(true);
	const [agencyLoading, setAgencyLoading] = useState(true);
	const [agenciesLoading, setAgenciesLoading] = useState(true);

	// change loading when everything loaded
	useEffect(() => {
		if (!userLoading && !umbrellaLoading && !agencyLoading && !agenciesLoading)
			setLoading(false);
	}, [loading, userLoading, umbrellaLoading, agencyLoading, agenciesLoading]);

	// the cnurrent user; null if not logged in
	const [user, setUser] = useState(null);

	// the umbrella the user is in
	const [umbrella, setUmbrella] = useState(null);

	// the agency the current user belongs to
	const [agency, setAgency] = useState(null);

	// all agencies in the same umbrella
	const [agencies, setAgencies] = useState(null);

	// the current page, starts with Calendar
	const [currentPage, setCurrentPage] = useState(AppPages.CALENDAR);

	const appViews = {
		[AppPages.CALENDAR.id]: (
			<CalendarView umbrella={umbrella} agency={agency} agencies={agencies} />
		),
		[AppPages.DIRECTORY.id]: <DirectoryView agencies={agencies} />,
		[AppPages.ACCOUNT.id]: (
			<AccountView umbrella={umbrella} user={user} agency={agency} />
		),
	};

	useEffect(() => {
		if (!umbrella) return;

		// Since firebase runs async, only update state if the app is mounted
		let mounted = true;

		if (!agencies) {
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
								address: agencyDoc.data().address,
								contact: agencyDoc.data().contact,
							});
						});
						if (mounted) {
							setAgencies(allAgencies);
							setAgenciesLoading(false);
						}
					});
			getAgencies();
		}

		return () => {
			// "unmount" the app so that firebase doesnt try to update the state of
			// an unmounted component
			mounted = false;
		};
	}, [umbrella, agencies, agenciesLoading]);

	useEffect(() => {
		if (!firebase) return;

		return firebase.auth().onAuthStateChanged(async (newUser) => {
			setUser(newUser);
			setUserLoading(false);

			// If a user logged in, get the agency they belong to
			if (newUser) {
				// When logged in, need to load data
				setUmbrellaLoading(true);
				setAgenciesLoading(true);
				setAgencyLoading(true);

				return firebase
					.firestore()
					.collection('users')
					.doc(newUser.uid)
					.get()
					.then((userDoc) => {
						firebase
							.firestore()
							.collection('umbrellas')
							.doc(userDoc.data().umbrella)
							.get()
							.then((umbrellaDoc) => {
								setUmbrella({
									id: umbrellaDoc.id,
									name: umbrellaDoc.data().name,
								});
								setUmbrellaLoading(false);
							});

						firebase
							.firestore()
							.collection('agencies')
							.doc(userDoc.data().agency)
							.get()
							.then((agencyDoc) => {
								setAgency({
									id: agencyDoc.id,
									type: agencyDoc.data().type,
									name: agencyDoc.data().name,
									approved: agencyDoc.data().approved,
								});
								setAgencyLoading(false);
							})
							.catch((error) => {
								debug('Could not fetch agency document', error);
							});
					})
					.catch((error) => {
						debug('Could not fetch user document', error);
					});
			} else {
				// When not logged in, don't need to load anything
				setUmbrella(null);
				setUmbrellaLoading(false);
				setAgencies(null);
				setAgenciesLoading(false);
				setAgency(null);
				setAgencyLoading(false);
			}
		});
	}, [user]);

	const logOut = () => firebase.auth().signOut();

	const changeView = (id) => setCurrentPage(AppPages[id]);

	return (
		<Layout className={`app-layout ${!user ? 'auth-page' : ''}`}>
			<Helmet>
				<html lang="en" />
				<title>
					{user
						? `${currentPage.title} | Meal Matchup`
						: 'Welcome to Meal Matchup'}
				</title>
			</Helmet>

			{/* Displays a loading spinner until the app is ready */}
			<Loading loading={loading} />

			{/* Only shows the sidebar if logged in */}
			{user && (
				<Layout.Sider
					className="app-sider"
					breakpoint="lg"
					collapsedWidth="0"
					width="300"
				>
					<div className="logo-container">
						<Logo color="#fff" />
					</div>

					{/* The sider menu */}
					<Menu className="sider-menu" selectedKeys={[currentPage.id]}>
						{SiderPages.map((page) => (
							<Menu.Item
								key={page.id}
								className="sider-link"
								onClick={() => changeView(page.id)}
							>
								{page.icon}
								{page.title}
							</Menu.Item>
						))}
					</Menu>
				</Layout.Sider>
			)}

			{/* The main app content panel */}
			<Layout className="app-inner-layout">
				{/* Show the logo here when not logged in as sider is hidden */}
				{!user && (
					<Layout.Header className="app-header">
						<div className="logo-container">
							<Logo />
						</div>
					</Layout.Header>
				)}

				{/* Show the app secondary nav when logged in */}
				{user && (
					<PageHeader
						className="app-page-header"
						title={currentPage.title}
						extra={[
							<Menu
								key="app-menu"
								className="app-menu"
								mode="horizontal"
								selectedKeys={[currentPage.id]}
							>
								<Menu.Item
									key={AppPages.ACCOUNT.id}
									className="menu-link"
									onClick={() => changeView(AppPages.ACCOUNT.id)}
								>
									{user.displayName ? user.displayName : AppPages.ACCOUNT.title}
								</Menu.Item>

								<Menu.Item className="menu-link" onClick={logOut}>
									Log Out
								</Menu.Item>
							</Menu>,
						]}
					/>
				)}

				<Layout.Content className={`app-content ${user ? 'has-sider' : ''}`}>
					{user ? appViews[currentPage.id] : <Auth />}
				</Layout.Content>
			</Layout>
		</Layout>
	);
}

export default App;

export { AgencyTypes, AppPages };
