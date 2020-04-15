import React, { useState, useEffect } from 'react';
import firebase from 'gatsby-plugin-firebase';
import { Descriptions } from 'antd';
import debug from 'debug';

import App, { AppPages } from '../components/App';
import SEO from '../components/SEO';

function IndexPage() {
	const [user, setUser] = useState(null);
	const [umbrella, setUmbrella] = useState(null);

	useEffect(() => {
		if (!firebase) return;

		return firebase.auth().onAuthStateChanged((newUser) => {
			if (!newUser) return setUser(newUser);

			return firebase
				.firestore()
				.collection('users')
				.doc(newUser.uid)
				.get()
				.then((doc) => {
					if (umbrella) return;
					if (doc.exists && doc.data().umbrella) {
						return doc
							.data()
							.umbrella.get()
							.then((umbrellaDoc) => {
								setUmbrella(umbrellaDoc.data().name);
							})
							.catch((e) => {
								debug('Unable to get umbrella', e);
							});
					}
				})
				.then(() => {
					setUser(newUser);
				});
		});
	}, [user, umbrella]);

	return (
		<App pageId={AppPages.Account}>
			<SEO title="My Account | Meal Matchup" description="" />

			{user && (
				<Descriptions column={1} bordered>
					<Descriptions.Item label="Name">{user.displayName}</Descriptions.Item>

					<Descriptions.Item label="Organization">{umbrella}</Descriptions.Item>
				</Descriptions>
			)}
		</App>
	);
}

export default IndexPage;
