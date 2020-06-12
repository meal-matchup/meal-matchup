import { AgencyTypeNames, AgencyTypes } from "../../../utils/enums";
import { AppContext, AppPage } from "../";
import { Button, Descriptions, Tooltip } from "antd";
import { CheckCircleTwoTone, ClockCircleTwoTone } from "@ant-design/icons";
import EditDeliverers from "./EditDeliverers";
import React from "react";

interface AccountViewState {
	editingDeliverers: boolean;
}

class AccountView extends React.Component<
	React.ComponentProps<"div">,
	AccountViewState
> {
	/** Initializes the account view */
	constructor(props: React.ComponentProps<"div">) {
		super(props);

		this.toggleEditingDeliverers = this.toggleEditingDeliverers.bind(this);

		this.state = {
			editingDeliverers: false,
		};
	}

	/** Toggles the edit deliverers modal */
	toggleEditingDeliverers() {
		this.setState({ editingDeliverers: !this.state.editingDeliverers });
	}

	/** Renders the account view component */
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
								{appContext.userData?.admin
									? "Admin"
									: appContext.user?.displayName}
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

							{/**
							 * Admins don't have an agency so do not render agency data
							 * for them.
							 */}
							{!appContext.userData?.admin && (
								<>
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

									{appContext.agency &&
										appContext.agency.data().type === AgencyTypes.DELIVERER && (
											<Descriptions.Item label="Deliverers">
												<ul style={{ paddingLeft: 0 }}>
													{(appContext.agency.data()?.users &&
														appContext.agency
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
																		<a href={`mailto:${user.email}`}>
																			{user.email}
																		</a>
																		)
																	</li>
																)
															)) ||
														"No deliverers"}
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
								</>
							)}
						</Descriptions>
					</AppPage>
				)}
			</AppContext.Consumer>
		);
	}
}

export default AccountView;
