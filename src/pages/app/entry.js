import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import firebase from 'gatsby-plugin-firebase';
import { navigate } from 'gatsby';
import { motion } from 'framer-motion';
import moment from 'moment';
import {
	Layout,
	Row,
	Col,
	Divider,
} from 'antd';
import debug from 'debug';

function EntryPage({ location }) {
	// Only allow entry page if there is a key
	if (!location.search) navigate('/');

	const params = new URLSearchParams(location.search);
	const key = params.get('key');

	// Only allow entry page if there is a key
	if (!key || key === '') navigate('/');

	const [loading, setLoading] = useState(true);
	const [deliveryDate, setDeliveryDate] = useState(new Date());

	useEffect(() => {
		if (!firebase || !loading) return;

		let mounted = true;

		const getRequestOccurrence = async () =>
			await firebase
				.firestore()
				.collection('keys')
				.doc(key)
				.get()
				.then((doc) => {
					setDeliveryDate(doc.data().date.toDate());
					if (mounted) setLoading(false);
				})
				.catch((e) => {
					debug(e);
					console.log(e);
					// if (mounted) navigate('/');
				});

		getRequestOccurrence();

		return () => (mounted = false);
	}, [loading]);

	return (
		!loading && (
			<motion.div
				variants={{
					initial: {
						opacity: 0,
					},
					visible: {
						opacity: 1,
					},
				}}
				initial="initial"
				animate="visible"
				style={{ height: "100%" }}
			>
				<Layout style={{ height: "100%" }}>
					<Layout.Header theme="dark">
						<h1>Meal Matchup</h1>
					</Layout.Header>
					<Layout.Content style={{ background: "white", padding: '1em' }}>
						<Row gutter={16}>
							<Col span={24}>
								<p>
									Please use this form to fill out the food log for your recent delivery.
								</p>
							</Col>
						</Row>

						<Divider />

						<Row gutter={16}>
							<Col span={24}>
								<h1>Delivery on {moment(deliveryDate).format('MMMM D, YYYY')}</h1>
							</Col>
						</Row>
					</Layout.Content>
				</Layout>
			</motion.div>
		)
	);
}

EntryPage.propTypes = {
	location: PropTypes.shape({
		search: PropTypes.string,
	}).isRequired,
};

export default EntryPage;
