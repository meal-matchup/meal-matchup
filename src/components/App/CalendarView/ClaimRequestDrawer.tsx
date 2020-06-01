import {
	AgencyTypes,
	AgencyUser,
	RequestTypeNames,
} from "../../../utils/enums";
import {
	Button,
	Checkbox,
	Col,
	Divider,
	Form,
	Input,
	Row,
	Select,
	message,
} from "antd";
import { Drawer } from "../";
import { FormInstance } from "antd/lib/form";
import React from "react";
import { Store } from "antd/lib/form/interface";
import firebase from "gatsby-plugin-firebase";

interface ClaimRequestDrawerProps {
	open?: boolean;
	onClose?: () => void;
	request?: firebase.firestore.DocumentSnapshot;
	agency?: firebase.firestore.DocumentSnapshot;
}

interface ClaimRequestDrawerState {
	claiming: boolean;
	newDelivererEmail: string;
	newDelivererName: string;
	selectedDeliverers: string[];
}

class ClaimRequestDrawer extends React.Component<
	ClaimRequestDrawerProps,
	ClaimRequestDrawerState
> {
	constructor(props: ClaimRequestDrawerProps) {
		super(props);

		this.addDeliverer = this.addDeliverer.bind(this);
		this.claimRequest = this.claimRequest.bind(this);
		this.onClose = this.onClose.bind(this);
		this.updateDeliverers = this.updateDeliverers.bind(this);

		this.state = {
			claiming: false,
			newDelivererEmail: "",
			newDelivererName: "",
			selectedDeliverers: [],
		};
	}

	formRef = React.createRef<FormInstance>();

	onClose() {
		this.setState({ selectedDeliverers: [] });
		this.formRef.current?.setFieldsValue({
			deliverers: [],
		});

		if (this.props.onClose) this.props.onClose();
	}

	updateDeliverers(selectedDeliverers: string[]) {
		this.setState({ selectedDeliverers });
	}

	claimRequest(values: Store) {
		if (!firebase || !this.props.agency || !this.props.request) return false;

		const { agency, request } = this.props;
		const agencyData = agency.data();

		if (!agencyData) return false;

		this.setState({ claiming: true });

		if (agency.data()?.type === AgencyTypes.DELIVERER) {
			const deliverers = agencyData.users?.filter(
				(x: { name: string }) => values.deliverers.indexOf(x.name) > -1
			);

			firebase
				.firestore()
				.collection("requests")
				.doc(request.id)
				.update({
					[agencyData.type.toLocaleLowerCase()]: agency.id,
					deliverers,
				})
				.then(() => {
					this.setState({ claiming: false });
					this.onClose();
					message.success("Successfully claimed request");
				})
				.catch(() => {
					this.setState({ claiming: false });
					message.error("Could not claim request");
				});
		} else {
			firebase
				.firestore()
				.collection("requests")
				.doc(request.id)
				.update({
					[agencyData.type.toLocaleLowerCase()]: agency.id,
				})
				.then(() => {
					this.setState({ claiming: false });
					this.onClose();
					message.success("Successfully claimed request");
				})
				.catch(() => {
					this.setState({ claiming: false });
					message.error("Could not claim request");
				});
		}
	}

	addDeliverer(values: Store) {
		const { name, email } = values.newDeliverer;
		if (!name || !email || !this.props.agency) return false;

		const newUser: AgencyUser = {
			name,
			email,
		};

		this.props.agency.ref
			.update({
				users: firebase.firestore.FieldValue.arrayUnion(newUser),
			})
			.then(() => {
				message.success("Added deliverer");
			});
	}

	render() {
		const { open, request, agency } = this.props;
		const { claiming, selectedDeliverers } = this.state;
		const agencyData = agency?.data();

		if (!request || !agency || !agencyData) return null;

		const formId = "claim-request-form";

		const deliverers = agencyData.users?.map(
			(user: { name: string }) => user.name
		);
		const filteredDeliverers = deliverers?.filter(
			(x: string) => !selectedDeliverers.includes(x)
		);

		return (
			<Drawer
				visible={!!open}
				title="Claiming Request"
				onClose={this.onClose}
				footer={
					<div style={{ textAlign: "right" }}>
						<Button onClick={this.onClose} disabled={claiming}>
							Cancel
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							form={formId}
							style={{ marginLeft: 8 }}
							disabled={claiming}
						>
							Claim
						</Button>
					</div>
				}
			>
				<Form id={formId} ref={this.formRef} onFinish={this.claimRequest}>
					<Row gutter={16}>
						<Col span={24}>
							<h2>Important!</h2>

							<p>
								<strong>
									You are about to claim a{" "}
									{RequestTypeNames[request?.data()?.type]} request!
								</strong>
							</p>

							<p>
								By claiming a request, you agree to complete the request as
								scheduled. If you cannot commit to this, please do not claim
								this request.
							</p>
						</Col>
					</Row>

					<Divider />

					{agency.data()?.type === AgencyTypes.DELIVERER && (
						<Form.Item
							name="deliverers"
							rules={[
								{
									required: true,
									message: "You must select at least one deliverer",
								},
							]}
						>
							<Select
								mode="multiple"
								value={selectedDeliverers}
								onChange={this.updateDeliverers}
								disabled={claiming}
								placeholder="Deliverers"
								dropdownRender={menu => (
									<div>
										{menu}

										<Divider style={{ margin: "4px 0" }} />

										<div style={{ padding: 8 }}>
											<Form layout="inline" onFinish={this.addDeliverer}>
												<Form.Item
													name={["newDeliverer", "name"]}
													rules={[
														{
															required: true,
															message: "Enter a name",
														},
													]}
												>
													<Input type="text" placeholder="Name" />
												</Form.Item>

												<Form.Item
													name={["newDeliverer", "email"]}
													rules={[
														{
															required: true,
															message: "Enter an email",
														},
														{
															type: "email",
															message: "Enter an email",
														},
													]}
												>
													<Input type="email" placeholder="Email address" />
												</Form.Item>

												<Form.Item>
													<Button type="primary" htmlType="submit">
														Add
													</Button>
												</Form.Item>
											</Form>
										</div>
									</div>
								)}
							>
								{filteredDeliverers?.map((deliverer: string) => (
									<Select.Option key={deliverer} value={deliverer}>
										{deliverer}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					)}

					{agency.data()?.type === AgencyTypes.RECEIVER && (
						<>
							<Form.Item name="contactless" valuePropName="checked">
								<Checkbox>
									I would like this to be a contactless delivery
								</Checkbox>
							</Form.Item>

							<Form.Item
								name="agree"
								rules={[
									{
										validator: (_, value) =>
											value
												? Promise.resolve()
												: Promise.reject("You must agree to the statement"),
									},
								]}
								valuePropName="checked"
							>
								<Checkbox>I have read the above paragraph and agree</Checkbox>
							</Form.Item>
						</>
					)}
				</Form>
			</Drawer>
		);
	}
}

export default ClaimRequestDrawer;
