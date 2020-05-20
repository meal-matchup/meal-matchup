import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import firebase from 'gatsby-plugin-firebase';
import { navigate } from 'gatsby';
import { motion } from 'framer-motion';
import moment from 'moment';
import { Layout, Row, Col, Divider, Steps, Button, message } from 'antd';
import debug from 'debug';
import Delivery from './delivery';

function EntryPage({ location }) {
	// Only allow entry page if there is a key
	if (!location.search) return navigate('/');
	const params = new URLSearchParams(location.search);
	const key = params.get('key');

	// Only allow entry page if there is a key
	if (!key || key === '') return navigate('/');

	const [loading, setLoading] = useState(true);

	const [deliveryDate, setDeliveryDate] = useState(new Date());

	const [donatorInfo, setDonatorInfo] = useState(null);

	const [receiverInfo, setReceiverInfo] = useState(null);

	useEffect(() => {
		if (!firebase || !loading || !key) return;

		let mounted = true;
		const getRequestOccurrence = async () =>
			await firebase
				.firestore()
				.collection('keys')
				.doc(key)
				.get()
				.then((doc) => {
					setRequestID(doc.data().request);
					setDonatorInfo(doc.data().donator_info);
					setReceiverInfo(doc.data().receiver_info);
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
				style={{ height: '100%' }}
			>
				<Delivery
					donatorInfo={donatorInfo}
					receiverInfo={receiverInfo}
					date={deliveryDate}
				/>
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
