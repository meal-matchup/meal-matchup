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
				<Delivery /*SUZ FILL IN HERE think the strat is to pass the request then get the donating and recieving agencies within the delivery component? Not sure tho*/
					request={{
						dname: 'Local Point',
						daddress: '1245 NE Campus Pkwy, Seattle, WA 98105',
						dcontact: 'Steven',
						dnumber: '555-555-5555',
						rname: 'University Distrcit Food Bank',
						raddress: '5017 Roosevelt Way NE, Seattle, WA 98105',
						rcontact: 'Steven',
						rnumber: '555-555-5555',
					}}
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
