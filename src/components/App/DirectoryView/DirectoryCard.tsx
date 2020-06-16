import { AgencyTypeNames, AgencyTypes } from "../../../utils/enums";
import { Button, Card, Descriptions, message } from "antd";
import {
	CarOutlined,
	CheckOutlined,
	ShopOutlined,
	ShoppingCartOutlined,
} from "@ant-design/icons";
import AppContext from "../AppContext";
import Debug from "debug";
import React from "react";
import firebase from "gatsby-plugin-firebase";

const debug = Debug("http");

interface TypeIcons {
	[AgencyTypes: string]: React.ReactNode;
}

interface DirectoryCardProps {
	approved?: boolean;
	name?: string;
	id?: string;
	type?: AgencyTypes;
	contact?: {
		name: string;
		email: string;
		phone: string;
	};
	address?: {
		line1: string;
		line2?: string;
		city: string;
		state: string;
		zip: string;
	};
}

class DirectoryCard extends React.Component<DirectoryCardProps> {
	constructor(props: DirectoryCardProps) {
		super(props);
		this.approve = this.approve.bind(this);
	}

	approve() {
		const { id, name } = this.props;
		if (!id || !name) return;

		firebase
			.firestore()
			.collection("agencies")
			.doc(id)
			.update({ approved: true })
			.then(() => {
				message.success(`Approved ${name}`);
			})
			.catch(error => {
				debug(error);
				message.error("Could not approve agency");
			});
	}

	/** Renders the directory card */
	render() {
		const { approved, name, type, contact, address } = this.props;

		// If there is a missing prop, do not render a card
		if (!name || !type || !contact || !address) return null;

		const iconStyle = { fontSize: "1.5em" };

		const typeIcons: TypeIcons = {
			[AgencyTypes.DONATOR]: <ShopOutlined style={iconStyle} />,
			[AgencyTypes.DELIVERER]: <CarOutlined style={iconStyle} />,
			[AgencyTypes.RECEIVER]: <ShoppingCartOutlined style={iconStyle} />,
		};

		const gridStyle = { height: "100%", width: "50%" };

		const cardActions: React.ReactNode[] = [];

		if (!approved) {
			cardActions.push(
				<Button key="approveButton" type="primary" onClick={this.approve}>
					<CheckOutlined />
					Approve
				</Button>
			);
		}

		return (
			<AppContext.Consumer>
				{appContext => (
					<Card
						actions={appContext.userData?.admin ? cardActions : []}
						title={name}
						size="small"
						extra={
							<div style={{ alignItems: "center", display: "flex" }}>
								<span style={{ marginRight: "0.5em" }}>
									{AgencyTypeNames[type]}
								</span>
								{typeIcons[type]}
							</div>
						}
					>
						<Card.Grid hoverable={false} style={gridStyle}>
							<Descriptions title="Primary Contact">
								<Descriptions.Item>
									{contact.name}
									<br />
									<a href={`mailto:${contact.email}`}>{contact.email}</a>
									<br />
									{contact.phone}
								</Descriptions.Item>
							</Descriptions>
						</Card.Grid>

						<Card.Grid hoverable={false} style={gridStyle}>
							<Descriptions title="Address">
								<Descriptions.Item>
									{address.line1}
									<br />
									{address.line2 && address.line2}
									{address.line2 && <br />}
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
				)}
			</AppContext.Consumer>
		);
	}
}

export default DirectoryCard;
