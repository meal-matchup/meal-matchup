import React from "react";
import PropTypes from "prop-types";
import { AgencyTypes } from "../../Enums";
import { Card, Descriptions } from "antd";
import {
	ShopOutlined,
	ShoppingCartOutlined,
	CarOutlined,
} from "@ant-design/icons";

function DirectoryCard({ name, type, contact, address }) {
	const iconSize = "1.5em";
	const findType = type => {
		switch (type) {
			case AgencyTypes.DONATOR:
				return {
					type: "Donating Agency",
					icon: <ShopOutlined style={{ fontSize: iconSize }} />,
				};
			case AgencyTypes.DELIVERER:
				return {
					type: "Delivering Agency",
					icon: <CarOutlined style={{ fontSize: iconSize }} />,
				};
			case AgencyTypes.RECEIVER:
				return {
					type: "Receiving Agency",
					icon: <ShoppingCartOutlined style={{ fontSize: iconSize }} />,
				};
			default:
				return null;
		}
	};
	let displayType = findType(type);

	const gridStyle = {
		height: "100%",
		width: "50%",
	};

	return (
		<Card
			key={`card-${name}`}
			title={name}
			size="small"
			extra={[
				<div
					key={`${name}-icon-container`}
					style={{ alignItems: "center", display: "flex" }}
				>
					<span key={`${name}-type`} style={{ marginRight: ".5em" }}>
						{displayType.type}
					</span>
					{displayType.icon}
				</div>,
			]}
		>
			<Card.Grid style={gridStyle} hoverable={false}>
				<Descriptions title="Primary Contact">
					<Descriptions.Item>
						{contact.name}
						<br />
						{contact.email}
						<br />
						{contact.phone}
					</Descriptions.Item>
				</Descriptions>
			</Card.Grid>

			<Card.Grid style={gridStyle} hoverable={false}>
				<Descriptions title="Address">
					<Descriptions.Item>
						{address.line1}
						<br />
						{address.line2 && (
							<>
								{address.line2}
								<br />
							</>
						)}
						{address.city}, {address.state} {address.zip}
						{!address.line2 && (
							<>
								<br />
								&nbsp;
							</>
						)}
					</Descriptions.Item>
				</Descriptions>
			</Card.Grid>
		</Card>
	);
}

DirectoryCard.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	contact: PropTypes.shape({
		name: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		phone: PropTypes.string.isRequired,
	}).isRequired,
	address: PropTypes.shape({
		line1: PropTypes.string.isRequired,
		line2: PropTypes.string,
		city: PropTypes.string.isRequired,
		state: PropTypes.string.isRequired,
		zip: PropTypes.string.isRequired,
	}).isRequired,
};

export default DirectoryCard;
