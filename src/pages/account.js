import React, { useState, useEffect } from 'react';
import firebase from 'gatsby-plugin-firebase';
import { List } from 'antd';

import App, { AppPages } from '../components/App';
import SEO from '../components/SEO';

function IndexPage() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (!firebase) return;

		return firebase.auth().onAuthStateChanged(user => setUser(user));
	}, [user]);

	return (
		<App
			pageId={AppPages.Account}
		>
			<SEO title="Meal Matchup" description="" />

			{user && (
				<List>
					<List.Item>Name:</List.Item>
				</List>
			)}

		</App>
	);
}

export default IndexPage;
