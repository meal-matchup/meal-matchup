import { AnimatePresence, motion } from "framer-motion";
import {
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	Layout,
	PageHeader,
	Row,
	Steps,
	message,
} from "antd";
import { FormInstance, Rule } from "antd/lib/form";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { FoodLogItem } from "../../utils/enums";
import React from "react";
import { Store } from "antd/lib/form/interface";
import firebase from "gatsby-plugin-firebase";
import { formGoogleMapsUrl } from "../../utils/functions";
import moment from "moment";
import { navigate } from "gatsby";

interface EntryPageProps {
	location: {
		search?: string;
	};
}

type FormItem = string | number | { [key: string]: FormItem };

interface EntryPageState {
	currentStep: number;
	currentForm: string;
	donatorSignature?: string;
	formValues: {
		[key: string]: FormItem;
	};
	key?: string;
	keyDocument?: firebase.firestore.DocumentSnapshot;
	loading: boolean;
	logItems: FoodLogItem[];
	mounted: boolean;
	shouldLeave: boolean;
}

class EntryPage extends React.Component<EntryPageProps, EntryPageState> {
	constructor(props: EntryPageProps) {
		super(props);

		this.leave = this.leave.bind(this);
		this.previous = this.previous.bind(this);
		this.finishPickup = this.finishPickup.bind(this);
		this.finishFoodLog = this.finishFoodLog.bind(this);
		this.finishDropOff = this.finishDropOff.bind(this);

		const params = new URLSearchParams(this.props.location.search);
		const key = params.get("key");

		this.state = {
			currentForm: "pickup-form",
			currentStep: 0,
			formValues: {},
			key: key || undefined,
			loading: true,
			logItems: [],
			mounted: false,
			shouldLeave: !key || key === "",
		};
	}

	donatingFormRef = React.createRef<FormInstance>();
	receivingFormRef = React.createRef<FormInstance>();

	keySnapshot(): void {
		return void 0;
	}

	leave() {
		if (window && this.state.shouldLeave) {
			navigate("/");
		}
	}

	previous() {
		if (this.state.currentStep > 0) {
			this.setState({ currentStep: this.state.currentStep - 1 });

			switch (this.state.currentStep - 1) {
				case 0:
					this.setState({ currentForm: "pickup-form" });
					break;

				case 2:
					this.setState({ currentForm: "food-log-form" });
					break;
			}
		}
	}

	finishPickup(values: Store) {
		if (values.donating?.supervisor) {
			const newFormValues = { ...this.state.formValues };
			if (typeof newFormValues.donating !== "object") {
				newFormValues.donating = {};
			}

			newFormValues.donating.supervisor = values.donating.supervisor;

			this.donatingFormRef.current?.setFieldsValue(newFormValues);

			this.setState({
				currentStep: this.state.currentStep + 1,
				formValues: newFormValues,
				currentForm: "food-log-form",
				donatorSignature: values.donating.supervisor,
			});
		} else {
			message.error("You must enter a name");
		}
	}

	finishFoodLog(values: Store) {
		if (values.items && values.items.length === 0) {
			message.error("Please enter at least one item");
			return false;
		}

		const foodLogItems: FoodLogItem[] = [];
		values.items?.forEach((item: { name: string; weight: number }) => {
			foodLogItems.push({
				name: item.name,
				weight: item.weight,
			});
		});

		this.setState({
			currentStep: this.state.currentStep + 1,
			currentForm: "drop-off-form",
			logItems: foodLogItems,
		});
	}

	finishDropOff(values: Store) {
		if (values.receiving?.supervisor) {
			this.state.keyDocument?.ref
				.update({
					items: this.state.logItems,
					donatorSignature: this.state.donatorSignature,
					receiverSignature: values.receiving.supervisor,
					complete: true,
					password: this.state.key,
				})
				.then(() => {
					message.success("Saved food log!");
				});
		}
	}

	componentDidMount() {
		this.setState({ mounted: true });

		if (window && this.state.shouldLeave) {
			this.leave();
		}

		if (this.state.key) {
			this.keySnapshot = firebase
				.firestore()
				.collection("keys")
				.doc(this.state.key)
				.onSnapshot(snapshot => {
					if (this.state.mounted) {
						this.setState({
							keyDocument: snapshot,
						});
					}
				});
		}
	}

	componentDidUpdate() {
		if (window && this.state.shouldLeave) {
			this.leave();
		}

		if (this.state.loading && this.state.keyDocument) {
			this.setState({ loading: false });
		}
	}

	componentWillUnmount() {
		this.keySnapshot();
		this.setState({ mounted: false });
	}

	render() {
		const {
			currentForm,
			currentStep,
			formValues,
			keyDocument,
			loading,
			shouldLeave,
		} = this.state;

		if (!keyDocument || !keyDocument.data() || loading || shouldLeave)
			return null;

		const data = keyDocument.data();

		if (!data) return false;

		const { donatorInfo, receiverInfo } = data;

		const steps = [
			{
				title: "Pick Up",
				content: (
					<>
						<h2>Pick up the donation</h2>

						<Card title={donatorInfo.name}>
							<p>
								Primary Contact: {donatorInfo.contact.name} (
								<a href={`mailto:${donatorInfo.contact.email}`}>
									donatorInfo.contact.email
								</a>
								)
							</p>
							<p>
								<a href={`tel:${donatorInfo.phone}`}>{donatorInfo.phone}</a>
							</p>
							{donatorInfo.name}
							<br />
							{donatorInfo.address.line1}
							<br />
							{donatorInfo.address.line2 && donatorInfo.address.line2}
							{donatorInfo.address.line2 && <br />}
							{donatorInfo.address.city}, {donatorInfo.address.state}{" "}
							{donatorInfo.address.zip}
							<br />(
							<a href={formGoogleMapsUrl(donatorInfo.address)}>Google Maps</a>)
						</Card>

						<br />

						<p>
							Please enter the name of an employee or volunteer who supervised
							the pickup.
						</p>

						<Form
							id="pickup-form"
							onFinish={this.finishPickup}
							initialValues={formValues}
							ref={this.donatingFormRef}
						>
							<Form.Item
								name={["donating", "supervisor"]}
								rules={[{ required: true, message: "You must enter a name" }]}
							>
								<Input placeholder={donatorInfo.contact.name} />
							</Form.Item>
						</Form>
					</>
				),
			},
			{
				title: "Food Log",
				content: (
					<Form
						id={"food-log-form"}
						initialValues={this.state.formValues}
						onFinish={this.finishFoodLog}
					>
						<Row gutter={16}>
							<Col span={24}>
								<h2>Fill out food log</h2>
								<p>
									Make sure to enter the name and approximate weight (in pounds)
									of every item related to this delivery.
								</p>
							</Col>
						</Row>

						<Divider />

						<Form.List name="items">
							{(fields, { add, remove }) => (
								<>
									{fields.map(field => (
										<Row key={field.key} gutter={16}>
											<Col span={11}>
												<Form.Item
													name={[`${field.name}`, "name"]}
													rules={[
														{ required: true, message: "Please enter a name" },
													]}
												>
													<Input placeholder="Food" />
												</Form.Item>
											</Col>

											<Col span={11}>
												<Form.Item
													name={[`${field.name}`, "weight"]}
													rules={[
														{
															validator: (_: Rule, value: number) =>
																value && value > 0
																	? Promise.resolve()
																	: Promise.reject(
																			"Please enter a valid weight"
																	  ),
														},
													]}
												>
													<InputNumber
														formatter={value => `${value} lbs`}
														parser={value => `${value}`.replace(/[^\d.]/g, "")}
														placeholder="Weight (lbs)"
														style={{ width: "100%" }}
													/>
												</Form.Item>
											</Col>

											<Col span={2} style={{ padding: 0 }}>
												<Button
													type="link"
													onClick={() => remove(field.name)}
													style={{ padding: 0 }}
													block
												>
													<MinusCircleOutlined />
												</Button>
											</Col>
										</Row>
									))}

									<Form.Item>
										<Button type="dashed" onClick={add} block>
											<PlusOutlined />
											Add Item
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Form>
				),
			},
			{
				title: "Drop Off",
				content: (
					<>
						<h2>Drop off the donation</h2>

						<Card title={receiverInfo.name}>
							<p>
								Primary Contact: {receiverInfo.contact.name} (
								<a href={`mailto:${receiverInfo.contact.email}`}>
									receiverInfo.contact.email
								</a>
								)
							</p>
							<p>
								<a href={`tel:${receiverInfo.phone}`}>{receiverInfo.phone}</a>
							</p>
							{receiverInfo.name}
							<br />
							{receiverInfo.address.line1}
							<br />
							{receiverInfo.address.line2 && receiverInfo.address.line2}
							{receiverInfo.address.line2 && <br />}
							{receiverInfo.address.city}, {receiverInfo.address.state}{" "}
							{receiverInfo.address.zip}
							<br />(
							<a href={formGoogleMapsUrl(receiverInfo.address)}>Google Maps</a>)
						</Card>

						<br />

						<p>
							Please enter the name of an employee or volunteer who supervised
							the pickup.
						</p>

						<Form
							id="drop-off-form"
							onFinish={this.finishDropOff}
							initialValues={formValues}
							ref={this.receivingFormRef}
						>
							<Form.Item
								name={["receiving", "supervisor"]}
								rules={[{ required: true, message: "You must enter a name" }]}
							>
								<Input placeholder={donatorInfo.contact.name} />
							</Form.Item>
						</Form>
					</>
				),
			},
		];

		return (
			<Layout>
				<Layout.Header>
					<div
						style={{
							alignItems: "center",
							boxSizing: "border-box",
							color: "#fff",
							display: "flex",
							fontSize: "1.6em",
							justifyContent: "center",
						}}
					>
						Meal Matchup
					</div>
				</Layout.Header>

				<Layout.Content style={{ backgroundColor: "#fff" }}>
					<PageHeader
						title={`Delivery on
 ${moment(keyDocument.data()?.date.toDate()).format("MMMM D, YYYY")}`}
						ghost={false}
					/>

					<div style={{ padding: "16px 24px 76px" }}>
						{keyDocument.data()?.complete ? (
							<p>Thank you for completing this food log!</p>
						) : (
							<>
								<Steps current={currentStep}>
									{steps.map(step => (
										<Steps.Step key={step.title} title={step.title} />
									))}
								</Steps>

								<AnimatePresence exitBeforeEnter>
									<motion.div
										key={`step-${currentStep}`}
										variants={{
											hidden: {
												opacity: 0,
											},
											visible: {
												opacity: 1,
											},
										}}
										initial="hidden"
										animate="visible"
										exit="hidden"
									>
										{steps[currentStep].content}
									</motion.div>
								</AnimatePresence>

								<div
									style={{
										backgroundColor: "#fff",
										bottom: 0,
										boxShadow: "0 0 1px rgba(0, 0, 0, 0.1)",
										boxSizing: "border-box",
										display: "flex",
										flexDirection: "row-reverse",
										justifyContent: "space-between",
										left: 0,
										padding: "16px",
										position: "fixed",
										width: "100%",
									}}
								>
									{currentStep <= steps.length - 1 && (
										<Button type="primary" htmlType="submit" form={currentForm}>
											{currentStep === steps.length - 1 ? "Finish" : "Next"}
										</Button>
									)}

									{currentStep > 0 && (
										<Button onClick={this.previous}>Previous</Button>
									)}
								</div>
							</>
						)}
					</div>
				</Layout.Content>
			</Layout>
		);
	}
}

export default EntryPage;
