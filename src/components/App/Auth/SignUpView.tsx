import {
	Agency,
	AgencyTypeNames,
	AgencyTypes,
	AgencyUser,
} from "../../../utils/enums";
import { Button, Col, Divider, Form, Input, Row, Select, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { AppPage } from "../";
import { FormItemProps } from "antd/lib/form";
import React from "react";
import { Store } from "antd/lib/form/interface";
import firebase from "gatsby-plugin-firebase";

interface SignUpViewProps {
	changeView: () => void;
}

interface SignUpViewState {
	confirmStatus?: FormItemProps["validateStatus"];
	genericStatus?: FormItemProps["validateStatus"];
	mounted: boolean;
	password?: string;
	selectedAgencyType?: string;
	selectedUmbrella?: string;
	signingUp: boolean;
	umbrellas?: firebase.firestore.QuerySnapshot;
}

class SignUpView extends React.Component<SignUpViewProps, SignUpViewState> {
	/** Initializes the sign up view */
	constructor(props: SignUpViewProps) {
		super(props);

		this.state = {
			mounted: false,
			signingUp: false,
		};

		this.signUp = this.signUp.bind(this);
	}

	/**
	 * Signs up the user with their email and password, as well as the data
	 * required for their new agency.
	 *
	 * @param values An ant.design form values store
	 */
	signUp(values: Store) {
		if (!this.state.selectedUmbrella) return false;

		const agencyData: Agency = {
			address: {
				line1: values.signup.agencyAddressLine1,
				city: values.signup.agencyAddressCity,
				state: values.signup.agencyAddressState,
				zip: values.signup.agencyAddressZip,
			},
			approved: false,
			contact: {
				email: values.signup.agencyContactEmail,
				name: values.signup.agencyContactName,
				phone: values.signup.agencyContactPhone,
			},
			name: values.signup.agencyName,
			type: this.state.selectedAgencyType as AgencyTypes,
			umbrella: this.state.selectedUmbrella,
		};

		if (values.users && values.users.length > 0) {
			const users: AgencyUser[] = [];
			values.users.forEach((user: { name: string; email: string }) => {
				users.push({
					name: user.name,
					email: user.email,
				});
			});
			agencyData.users = users;
		}

		firebase
			.auth()
			.createUserWithEmailAndPassword(
				values.signup.email,
				values.signup.password
			)
			.then(result => {
				return result.user
					?.updateProfile({ displayName: values.signup.name })
					.then(() => {
						const batch = firebase.firestore().batch();

						const newAgencyRef = firebase
							.firestore()
							.collection("agencies")
							.doc();

						const userRef = firebase
							.firestore()
							.collection("users")
							.doc(result.user?.uid);

						batch.set(userRef, {
							umbrella: this.state.selectedUmbrella,
							agency: newAgencyRef.id,
						});

						agencyData.admins = {};
						agencyData.admins[userRef.id] = true;

						batch.set(newAgencyRef, agencyData);

						return batch.commit();
					});
			})
			.catch(e => {
				switch (e.code) {
					case "auth/weak-password":
						message.error(e.message);
						break;

					case "auth/email-already-in-use":
						message.error("This email is already in use. Try logging in");
						break;

					default:
						message.error("Could not create account");
						break;
				}
			});
	}

	/** Mounts the component and gets all umbrellas */
	componentDidMount() {
		this.setState({ mounted: true });

		firebase
			.firestore()
			.collection("umbrellas")
			.get()
			.then(snapshot => {
				// Don't try to update state if the component is not mounted anymore
				if (this.state.mounted) {
					this.setState({
						umbrellas: snapshot,
					});
				}
			});
	}

	/** Unmounts the component */
	componentWillUnmount() {
		this.setState({ mounted: false });
	}

	/** Renders the sign up view */
	render() {
		const { changeView } = this.props;
		const {
			genericStatus,
			selectedAgencyType,
			selectedUmbrella,
			signingUp,
			umbrellas,
		} = this.state;

		const umbrella = umbrellas?.docs.filter(x => x.id === selectedUmbrella)[0];

		return (
			<AppPage id="SignUpView">
				<Form layout="vertical" onFinish={this.signUp}>
					<Form.Item
						name={["signup", "name"]}
						label="Name"
						rules={[
							{
								required: true,
								message: "Please enter your name",
							},
						]}
						hasFeedback
						validateStatus={genericStatus}
					>
						<Input disabled={signingUp} type="text" />
					</Form.Item>

					<Form.Item
						name={["signup", "email"]}
						label="Email address"
						rules={[
							{
								required: true,
								type: "email",
								message: "Please enter your email address",
							},
						]}
						hasFeedback
						validateStatus={genericStatus}
					>
						<Input disabled={signingUp} type="email" />
					</Form.Item>

					<Form.Item
						name={["signup", "password"]}
						label="Password"
						rules={[
							{
								required: true,
								message: "Please enter a password",
							},
						]}
						hasFeedback
						validateStatus={genericStatus}
					>
						<Input
							disabled={signingUp}
							type="password"
							onChange={e => this.setState({ password: e.target.value })}
						/>
					</Form.Item>

					<Form.Item
						name={["signup", "confirm"]}
						label="Confirm password"
						rules={[
							{
								required: true,
								message: "Please confirm your password",
							},
							{
								validator: (_, value) =>
									value && this.state.password && this.state.password === value
										? Promise.resolve()
										: Promise.reject("Your passwords do not match"),
							},
						]}
						hasFeedback
						validateStatus={genericStatus}
					>
						<Input disabled={signingUp} type="password" />
					</Form.Item>

					<Form.Item
						name={["signup", "umbrella"]}
						label="Umbrella organization"
						rules={[
							{
								required: true,
								message: "Please select an Umbrella organization",
							},
						]}
					>
						<Select
							disabled={signingUp}
							onChange={(id: string) => this.setState({ selectedUmbrella: id })}
						>
							{umbrellas &&
								umbrellas.docs.map(umbrella => (
									<Select.Option key={umbrella.id} value={umbrella.id}>
										{umbrella.data().name}
									</Select.Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item
						name={["signup", "agency"]}
						label="Agency Type"
						rules={[
							{
								required: true,
								message: "Please select an Agency type",
							},
						]}
					>
						<Select
							disabled={signingUp}
							onChange={(type: string) =>
								this.setState({ selectedAgencyType: type })
							}
						>
							<Select.Option value={AgencyTypes.DONATOR}>
								{AgencyTypeNames[AgencyTypes.DONATOR]}
							</Select.Option>

							<Select.Option value={AgencyTypes.DELIVERER}>
								{AgencyTypeNames[AgencyTypes.DELIVERER]}
							</Select.Option>

							<Select.Option value={AgencyTypes.RECEIVER}>
								{AgencyTypeNames[AgencyTypes.RECEIVER]}
							</Select.Option>
						</Select>
					</Form.Item>

					{umbrella && selectedAgencyType && (
						<>
							<Form.Item
								name={["signup", "agencyName"]}
								label="Agency Name"
								rules={[
									{
										required: true,
										message: "Please enter the name of your agency",
									},
								]}
							>
								<Input disabled={signingUp} />
							</Form.Item>

							<Form.Item
								name={["signup", "agencyContactName"]}
								label="Point of Contact Name"
								extra={`This will be visible to all ${
									umbrella.data()?.name
								} members.`}
								rules={[
									{
										required: true,
										message: "Please enter the Point of Contact's name",
									},
								]}
							>
								<Input disabled={signingUp} />
							</Form.Item>

							<Form.Item
								name={["signup", "agencyContactEmail"]}
								label="Point of Contact Email"
								extra={`This will be visible to all ${
									umbrella.data()?.name
								} members.`}
								rules={[
									{
										required: true,
										type: "email",
										message: "Please enter the Point of Contact's email",
									},
								]}
							>
								<Input disabled={signingUp} type="email" />
							</Form.Item>

							<Form.Item
								name={["signup", "agencyContactPhone"]}
								label="Point of Contact Phone"
								extra={`This will be visible to all ${
									umbrella.data()?.name
								} members.`}
								rules={[
									{
										required: true,
										message: "Please enter the Point of Contact's phone",
									},
								]}
							>
								<Input disabled={signingUp} type="tel" />
							</Form.Item>

							{selectedAgencyType === AgencyTypes.DELIVERER && (
								<>
									<Divider />

									<h3>Deliverers</h3>

									<Form.List name="users">
										{(fields, { add, remove }) => (
											<>
												{fields.map(field => (
													<Row key={field.key} gutter={16}>
														<Col span={11}>
															<Form.Item
																name={[field.name, "name"]}
																rules={[
																	{
																		required: true,
																		message:
																			"Please enter the deliverer's name",
																	},
																]}
															>
																<Input placeholder="Name" />
															</Form.Item>
														</Col>

														<Col span={11}>
															<Form.Item
																name={[field.name, "email"]}
																rules={[
																	{
																		required: true,
																		type: "email",
																		message:
																			"Please enter the deliverer's email",
																	},
																]}
															>
																<Input placeholder="Email" type="email" />
															</Form.Item>
														</Col>

														<Col span={2} style={{ padding: 0 }}>
															<Button
																type="link"
																style={{ padding: 0 }}
																onClick={() => remove(field.name)}
																block
															>
																<MinusCircleOutlined />
															</Button>
														</Col>
													</Row>
												))}

												<Form.Item extra="These are the members in your organization who will be performing deliveries.">
													<Button type="dashed" onClick={add} block>
														<PlusOutlined /> Add Deliverer
													</Button>
												</Form.Item>
											</>
										)}
									</Form.List>

									<Divider />
								</>
							)}

							<Form.Item
								extra={`This will be visible to all ${
									umbrella.data()?.name
								} members.`}
							>
								<Row gutter={16}>
									<Col span={12}>
										<Form.Item
											name={["signup", "agencyAddressLine1"]}
											label="Street Address"
											rules={[
												{
													required: true,
													message:
														"Please enter the street address of your agency",
												},
											]}
										>
											<Input disabled={signingUp} placeholder="1 Fake Ave" />
										</Form.Item>
									</Col>

									<Col span={12}>
										<Form.Item
											name={["signup", "agencyAddressLine2"]}
											label="Line 2"
										>
											<Input disabled={signingUp} placeholder="Ste 100" />
										</Form.Item>
									</Col>
								</Row>

								<Row gutter={16}>
									<Col span={10}>
										<Form.Item
											name={["signup", "agencyAddressCity"]}
											label="City"
											rules={[
												{
													required: true,
													message: "Please enter the city of your agency",
												},
											]}
										>
											<Input disabled={signingUp} placeholder="Seattle" />
										</Form.Item>
									</Col>

									<Col span={10}>
										<Form.Item
											name={["signup", "agencyAddressState"]}
											label="State"
											rules={[
												{
													required: true,
													message: "Please enter the state of your agency",
												},
											]}
										>
											<Input disabled={signingUp} placeholder="WA" />
										</Form.Item>
									</Col>

									<Col span={4}>
										<Form.Item
											name={["signup", "agencyAddressZip"]}
											label="Zip"
											rules={[
												{
													required: true,
													message: "Please enter the zip of your agency",
												},
											]}
										>
											<Input disabled={signingUp} placeholder="98105" />
										</Form.Item>
									</Col>
								</Row>
							</Form.Item>
						</>
					)}

					<Form.Item>
						<Button disabled={signingUp} type="primary" htmlType="submit" block>
							Continue
						</Button>
					</Form.Item>
				</Form>

				<Divider />

				<p>
					Already have an account?
					<Button type="link" onClick={changeView}>
						Log in
					</Button>
				</p>
			</AppPage>
		);
	}
}

export default SignUpView;
