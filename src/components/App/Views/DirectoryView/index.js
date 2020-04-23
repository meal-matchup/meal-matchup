import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List, Select } from 'antd';

import DirectoryCard from './DirectoryCard';

import { AgencyTypes } from '../../Enums';

function DirectoryView({ agencies }) {
	const [filter, setFilter] = useState('ALL');
	agencies = agencies.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<>
			<Select
				defaultValue="ALL"
				style={{ width: 175, marginBottom: 20 }}
				onChange={setFilter}
			>
				<Select.Option value="ALL">All Agencies</Select.Option>
				<Select.Option value={AgencyTypes.DONATOR}>
					Donating Agencies
				</Select.Option>
				<Select.Option value={AgencyTypes.DELIVERER}>
					Delivering Agencies
				</Select.Option>
				<Select.Option value={AgencyTypes.RECEIVER}>
					Recieving Agencies
				</Select.Option>
			</Select>

			{agencies && (
				<List grid={{ gutter: 16, column: 1 }}>
					{agencies.map((agency) => {
						if (filter === 'ALL' || agency.type === filter) {
							return (
								<List.Item key={agency.name}>
									<DirectoryCard
										name={agency.name}
										type={agency.type}
										contact={agency.contact}
										address={agency.address}
									/>
								</List.Item>
							);
						}
					})}
				</List>
			)}
		</>
	);
}

DirectoryView.propTypes = {
	agencies: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
		})
	),
};

export default DirectoryView;
