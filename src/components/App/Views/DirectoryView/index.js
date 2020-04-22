import React, {useState } from 'react';
import firebase from 'gatsby-plugin-firebase';

import { AgencyTypes } from '../../Enums';
import { Select } from 'antd';
import DirectoryCard from './DirectoryCard';

const { Option } = Select;


function DirectoryView({ agencies }) {
	const [filter, setFilter] = useState('ALL');
	console.log(agencies)
	return (
		<div>
			<Select
				defaultValue="ALL"
				style={{ width: 175, marginLeft: 20 }}
				onChange={setFilter}
			>
				<Option value="ALL">All Agencies</Option>
				<Option value={AgencyTypes.DONATOR}>Donating Agencies</Option>
				<Option value={AgencyTypes.DELIVERER}>Delivering Agencies</Option>
				<Option value={AgencyTypes.RECEIVER}>Recieving Agencies</Option>
			</Select>
			<div>
				{agencies &&
					agencies.map((agency) => {
						if (filter === 'ALL') {
							return (
								<DirectoryCard
									key={agency.name}
									name={agency.name}
									type={agency.type}
									contact={agency.contact}
									address={agency.address}
								/>
							);
						} else if(agency.type === filter) {
							return (
								<DirectoryCard
									key={agency.name}
									name={agency.name}
									type={agency.type}
									contact={agency.contact}
									address={agency.address}
								/>
							);
						}
					})}
			</div>
		</div>
	);
}

export default DirectoryView;
