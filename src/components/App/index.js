import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import firebase from 'gatsby-plugin-firebase';
import { Avatar, Layout, Menu } from 'antd';
import {
	CalendarOutlined,
	ContactsOutlined,
} from '@ant-design/icons';

import * as AppPages from './AppPages';
import Auth from '../Auth';
import { Logo } from '../../graphics/graphics';

const { Sider, Header, Content, Footer } = Layout;


function App({ authRequired = true, pageId, children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (!firebase) return;

		return firebase.auth().onAuthStateChanged(user => setUser(user));
	}, [user]);

	const logOut = () => firebase.auth().signOut();

	return (
		<Layout className={`app-layout ${!user ? 'auth-page' : ''}`}>
			{user && (
				<Sider
					className="app-sider"
					breakpoint="lg"
					collapsedWidth="0"
					width="300"
				>
					<div className="logo-container">
						<Logo  color="#fff" />
					</div>

					<Menu
						className="sider-menu"
						selectedKeys={[ pageId ]}
						mode="inline"
						theme="dark"
					>
						<Menu.Item key={AppPages.Calendar} className="sider-link">
							<Link to="/">
								<CalendarOutlined />
								Calendar
							</Link>
						</Menu.Item>

						<Menu.Item key={AppPages.Directory} className="sider-link">
							<Link to="/directory">
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
								selectedKeys={[ pageId ]}
							>
								<Menu.Item
									key={AppPages.Account}
									className="menu-link"
								>
									<Link to="/account">
										<Avatar
											className="menu-avatar"
											src={user.photoURL}
										/>
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
					{authRequired && !user ? <Auth /> : children}
				</Content>

				<Footer className="app-footer">
					© 2020 Meal Matchup
				</Footer>
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

export { AppPages };
