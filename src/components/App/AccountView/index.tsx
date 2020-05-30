import { AgencyTypeNames, AgencyTypes } from "../../../utils/enums";
import { AppContext, AppPage } from "../";
import { Button, Descriptions, Tooltip } from "antd";
import { CheckCircleTwoTone, ClockCircleTwoTone } from "@ant-design/icons";
import EditDeliverers from "./EditDeliverers";
import { InferProps } from "prop-types";
import React from "react";

interface AccountViewState {
	editingDeliverers: boolean;
}

class AccountView extends React.Component<
	InferProps<typeof AccountView.propTypes>,
	AccountViewState
> {
	static propTypes = {};

	constructor(props: InferProps<typeof AccountView.propTypes>) {
		super(props);

		this.toggleEditingDeliverers = this.toggleEditingDeliverers.bind(this);

		this.state = {
			editingDeliverers: false,
		};
	}

	toggleEditingDeliverers() {
		this.setState({ editingDeliverers: !this.state.editingDeliverers });
	}

	render() {
		const { editingDeliverers } = this.state;

		return (
			<AppContext.Consumer>
				{appContext => (
					<AppPage id="AccountView">
						<EditDeliverers
							visible={editingDeliverers}
							onClose={this.toggleEditingDeliverers}
							users={appContext.agency?.data()?.users}
							agencyId={appContext.agency?.id}
						/>

						<Descriptions column={1} bordered>
							<Descriptions.Item label="Name">
								{appContext.user?.displayName}
							</Descriptions.Item>

							<Descriptions.Item label="Email address">
								{appContext.user?.email}
								{!!appContext.user?.emailVerified && (
									<CheckCircleTwoTone
										twoToneColor="#52c41a"
										style={{ marginLeft: "0.5em" }}
									/>
								)}
							</Descriptions.Item>

							<Descriptions.Item label="Umbrella">
								{appContext.umbrella?.data()?.name}
							</Descriptions.Item>

							<Descriptions.Item label="Agency">
								{appContext.agency?.data()?.name}
								{appContext.agency?.data()?.approved ? (
									<Tooltip title="Your agency has been approved">
										<CheckCircleTwoTone
											twoToneColor="#52c41a"
											style={{ marginLeft: "0.5em" }}
										/>
									</Tooltip>
								) : (
									<Tooltip title="Your agency is pending approval">
										<ClockCircleTwoTone style={{ marginLeft: "0.5em" }} />
									</Tooltip>
								)}
							</Descriptions.Item>

							<Descriptions.Item label="Agency type">
								{
									AgencyTypeNames[
										appContext.agency?.data()?.type || AgencyTypes.DELIVERER
									]
								}
							</Descriptions.Item>

							{appContext.agency && (
								<Descriptions.Item label="Deliverers">
									<ul style={{ paddingLeft: 0 }}>
										{appContext.agency
											.data()
											?.users.map(
												(
													user: { name: string; email: string },
													index: number
												) => (
													<li
														key={`agency-users-${index}`}
														style={{ marginLeft: "1em" }}
													>
														{user.name} (
														<a href={`mailto:${user.email}`}>{user.email}</a>)
													</li>
												)
											)}
									</ul>
									<Button onClick={this.toggleEditingDeliverers}>
										Edit Deliverers
									</Button>
								</Descriptions.Item>
							)}

							<Descriptions.Item label="Agency address">
								{appContext.agency?.data()?.address.line1}
								<br />
								{appContext.agency?.data()?.address.line2 &&
									appContext.agency?.data()?.address.line2}
								{appContext.agency?.data()?.address.line2 && <br />}
								{appContext.agency?.data()?.address.city},{" "}
								{appContext.agency?.data()?.address.state}{" "}
								{appContext.agency?.data()?.address.zip}
							</Descriptions.Item>
						</Descriptions>
					</AppPage>
				)}
			</AppContext.Consumer>
		);
	}
}

export default AccountView;
