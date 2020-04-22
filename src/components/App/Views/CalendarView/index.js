import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import firebase from 'gatsby-plugin-firebase';
import moment from 'moment';
import { AnimatePresence, motion } from 'framer-motion';

import { Badge, Button, Calendar } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import PickupRequest from './PickupRequest';

import { AgencyTypes, RequestTypes } from '../../Enums';

function CalendarView({ umbrella, agency, agencies }) {
	// Variables to show on calendar
	const [requests, setRequests] = useState(null);
	const [selectedDate, setSelectedDate] = useState(moment());

	useEffect(() => {
		if (!firebase || !umbrella || !agency || requests !== null) return;

		let mounted = true;

		const getRequests = async () =>
			firebase
				.firestore()
				.collection('requests')
				.where('umbrella', '==', umbrella.id)
				.get()
				.then((querySnapshot) => {
					const allRequests = [];
					querySnapshot.forEach((requestDoc) => {
						const theRequest = {
							id: requestDoc.id,
							...requestDoc.data(),
						};

						// Only show Donating Agencies the pickups they have scneduled
						if (
							agency.type === AgencyTypes.DONATOR &&
							requestDoc.data().donator === agency.id
						) {
							allRequests.push(theRequest);
						} else {
							if (
								requestDoc.data()[agency.type.toLowerCase()] === 'any' ||
								requestDoc.data()[agency.type.toLowerCase()] === agency.id
							) {
								allRequests.push(theRequest);
							}
						}
					});
					if (mounted) setRequests(allRequests);
				});
		getRequests();

		return () => {
			mounted = false;
		};
	}, [requests, umbrella, agency]);

	const isSameWeekdayInPeriod = (from, to, date) => {
		const weekday = from.getDay();
		return date.getDay() === weekday && date >= from && date <= to;
	};

	const getRequestTitle = (request) => {
		switch (request.type) {
			case RequestTypes.PICKUP:
				return 'Pickup Request';

			default:
				return 'Request';
		}
	};

	const dateCellRender = (value) => {
		const reqeustsOnDate = requests.filter((x) =>
			isSameWeekdayInPeriod(
				x.dates.from.toDate(),
				x.dates.to.toDate(),
				value.toDate()
			)
		);

		return reqeustsOnDate.length > 0 ? (
			<ul className="events">
				{reqeustsOnDate.map((request) => (
					<li key={request.id}>
						<Badge
							status={
								request.delivererStatus && request.receiverStatus
									? 'success'
									: 'default'
							}
							text={getRequestTitle(request)}
						/>
					</li>
				))}
			</ul>
		) : null;
	};

	// Variables for pickup request form
	const [pickupRequestDrawerOpen, setPickupRequestDrawerOpen] = useState(false);

	return (
		<>
			<div
				className="events-calendar"
				style={{ height: '100%', position: 'relative', width: '100%' }}
			>
				<AnimatePresence exitBeforeEnter>
					{requests && (
						<motion.div
							variants={{
								hidden: {
									opacity: 0,
								},
								visible: {
									opacity: 1,
								},
							}}
							initial="hidden"
							animate="visible"
							exit="hidden"
						>
							<h1>{selectedDate.format('MMMM')}</h1>
							<Calendar
								dateCellRender={dateCellRender}
								onChange={setSelectedDate}
							/>
						</motion.div>
					)}
					{!requests && (
						<motion.div
							variants={{
								hidden: {
									opacity: 0,
								},
								visible: {
									opacity: 1,
								},
							}}
							initial="hidden"
							animate="visible"
							exit="hidden"
							style={{
								left: '50%',
								position: 'absolute',
								top: '50%',
								transform: 'translate3d(-50%, -50%, 0) scale(3)',
							}}
						>
							<LoadingOutlined />
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className="calendar-buttons-container">
				{agency && agency.type === AgencyTypes.DONATOR && agencies && (
					<Button
						type="primary"
						onClick={() => setPickupRequestDrawerOpen(true)}
					>
						New Pickup Request
					</Button>
				)}
			</div>

			{umbrella &&
				agency &&
				agency.type === AgencyTypes.DONATOR &&
				agencies && (
					<PickupRequest
						open={pickupRequestDrawerOpen}
						onClose={() => setPickupRequestDrawerOpen(false)}
						umbrella={umbrella}
						agency={agency}
						agencies={agencies}
					/>
				)}
		</>
	);
}

CalendarView.propTypes = {
	umbrella: PropTypes.shape({
		id: PropTypes.string.isRequired,
	}),
	agency: PropTypes.shape({
		id: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}),
	agencies: PropTypes.array,
};

export default CalendarView;
