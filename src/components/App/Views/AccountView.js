import React from 'react';
import PropTypes from 'prop-types';
import { Descriptions, Tooltip } from 'antd';
import { CheckCircleTwoTone, ClockCircleTwoTone } from '@ant-design/icons';

import { AgencyTypes } from '../Enums';

function AccountView({ user, umbrella, agency }) {
	const agencyTypes = {
		[AgencyTypes.DONATOR]: 'Donating Agency',
		[AgencyTypes.RECEIVER]: 'Receiving Agency',
		[AgencyTypes.DELIVERER]: 'Delivering Agency',
	};

	return (
		<>
			{user && umbrella && agency && (
				<Descriptions column={1} bordered>
					<Descriptions.Item label="Name">{user.displayName}</Descriptions.Item>
					<Descriptions.Item label="Email address">
						{user.email}
						{!!user.emailVerified && (
							<CheckCircleTwoTone
								twoToneColor="#52c41a"
								style={{ marginLeft: '.5em' }}
							/>
						)}
					</Descriptions.Item>
					<Descriptions.Item label="Umbrella">
						{umbrella.name}
					</Descriptions.Item>
					<Descriptions.Item label="Agency">
						{agency.name}
						{agency.approved ? (
							<Tooltip title="Your agency has been approved">
								<CheckCircleTwoTone
									twoToneColor="#52c41a"
									style={{ marginLeft: '.5em' }}
								/>
							</Tooltip>
						) : (
							<Tooltip title="Your agency is pending approval">
								<ClockCircleTwoTone style={{ marginLeft: '.5em' }} />
							</Tooltip>
						)}
					</Descriptions.Item>
					<Descriptions.Item label="Agency type">
						{agencyTypes[agency.type]}
					</Descriptions.Item>
					<Descriptions.Item label="Agency address">
						{agency.address.line1}
						<br />
						{agency.address.line2 && agency.address.line2}
						{agency.address.line2 && <br />}
						{agency.address.city}, {agency.address.state} {agency.address.zip}
					</Descriptions.Item>
				</Descriptions>
			)}
		</>
	);
}

AccountView.propTypes = {
	user: PropTypes.shape({
		displayName: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		emailVerified: PropTypes.bool,
	}),
	umbrella: PropTypes.shape({
		name: PropTypes.string.isRequired,
		id: PropTypes.string,
	}),
	agency: PropTypes.shape({
		approved: PropTypes.bool.isRequired,
		name: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		address: PropTypes.shape({
			line1: PropTypes.string.isRequired,
			line2: PropTypes.string,
			city: PropTypes.string.isRequired,
			state: PropTypes.string.isRequired,
			zip: PropTypes.string.isRequired,
		}).isRequired,
	}),
};

export default AccountView;
