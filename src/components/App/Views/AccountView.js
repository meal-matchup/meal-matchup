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
				<Descriptions.Item label="Umbrella">{umbrella.name}</Descriptions.Item>
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
			</Descriptions>
		</>
	);
}

AccountView.propTypes = {
	user: PropTypes.shape({
		displayName: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		emailVerified: PropTypes.bool,
	}).isRequired,
	umbrella: PropTypes.shape({
		name: PropTypes.string.isRequired,
		id: PropTypes.string,
	}).isRequired,
	agency: PropTypes.shape({
		approved: PropTypes.bool.isRequired,
		name: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
	}).isRequired,
};

export default AccountView;
