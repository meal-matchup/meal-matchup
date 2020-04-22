import React, {useState } from 'react';
import firebase from 'gatsby-plugin-firebase';

import { AgencyTypes } from '../../Enums';
import { Select, Row, Col  } from 'antd';
import DirectoryCard from './DirectoryCard';
const { Option } = Select;

function DirectoryView({ agencies }) {
	const [filter, setFilter] = useState('ALL');
	agencies = agencies.sort((a, b) => a.name.localeCompare(b.name))
	return (
		<div>
			<Select
				defaultValue="ALL"
				style={{ width: 175, marginBottom: 20 }}
				onChange={setFilter}
			>
				<Option value="ALL">All Agencies</Option>
				<Option value={AgencyTypes.DONATOR}>Donating Agencies</Option>
				<Option value={AgencyTypes.DELIVERER}>Delivering Agencies</Option>
				<Option value={AgencyTypes.RECEIVER}>Recieving Agencies</Option>
			</Select>
			<div>
				{agencies &&
					<Row>
						{agencies.map((agency) => {
							if (filter === 'ALL') {
								return (
									<Col key={agency.name} span={24}>
										<DirectoryCard
											name={agency.name}
											type={agency.type}
											contact={agency.contact}
											address={agency.address}
										/>
									</Col>
								);
							} else if(agency.type === filter) {
								return (
									<Col key={agency.name} span={24}>
										<DirectoryCard
											name={agency.name}
											type={agency.type}
											contact={agency.contact}
											address={agency.address}
										/>
									</Col>
								);
							}
						})}
					</Row>
					}
			</div>
		</div>
	);
}

export default DirectoryView;
