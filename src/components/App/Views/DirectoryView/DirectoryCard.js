import React from 'react';
import { Card } from 'antd';
import { AgencyTypes } from '../../Enums';
import { Row, Col } from 'antd';
import {
	ShopOutlined,
	ShoppingCartOutlined,
	CarOutlined,
} from '@ant-design/icons';

function DirectoryCard({ name, type, contact, address }) {

	let iconSize = '20px';
	const findType = (type) => {
		if (type === AgencyTypes.DONATOR) {
			return {
				type: 'Donating Agency',
				icon: <ShopOutlined style={{ fontSize : iconSize }} />,
			};
		} else if (type === AgencyTypes.DELIVERER) {
			return {
				type: 'Delivering Agency',
				icon: <CarOutlined style={{ fontSize : iconSize }} />,
			};
		} else if (type === AgencyTypes.RECEIVER) {
			return {
				type: 'Recieving Agency',
				icon: <ShoppingCartOutlined style={{ fontSize : iconSize }} />,
			};
		} else {
			return {}
		}
	};
	let displayType = findType(type);

	return (
		<div>
			<Card
				title={name}
				extra={displayType.icon}
				style={{ width: 500, margin: 20 }}
			>
				<Row style={{ width: 500}}>
					<Col span={12}>
						<p>
							<b>Primary Contact</b>
						</p>
						{contact.name && <p>{contact.name}</p>}
						{contact.email && <p>{contact.email}</p>}
						{contact.phone && <p>{contact.phone}</p>}
					</Col>
					<Col span={12}>
						<p>
							<b>Address</b>
						</p>
						{address.line1 && <p>{address.line1}</p>}
						{address.city && (
							<p>
								{address.city} {address.state}, {address.zip}
							</p>
						)}
					</Col>
				</Row>
				</Card>
		</div>
	);
}

export default DirectoryCard;
