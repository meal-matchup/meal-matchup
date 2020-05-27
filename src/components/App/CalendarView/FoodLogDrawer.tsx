import {
	Button,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	Row,
	message,
} from "antd";
import { FoodLogEntry, FoodLogItem, Request } from "../../../utils/enums";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Drawer } from "../";
import React from "react";
import { Rule } from "antd/lib/form";
import { Store } from "antd/lib/form/interface";
import firebase from "gatsby-plugin-firebase";

interface FoodLogDrawerProps {
	open?: boolean;
	onClose?: () => void;
	request?: firebase.firestore.QueryDocumentSnapshot;
	occurrenceIndex?: number;
}

class FoodLogDrawer extends React.Component<FoodLogDrawerProps> {
	constructor(props: FoodLogDrawerProps) {
		super(props);

		this.onClose = this.onClose.bind(this);
		this.submitFoodLog = this.submitFoodLog.bind(this);
	}

	onClose() {
		if (this.props.onClose) this.props.onClose();
	}

	submitFoodLog(values: Store) {
		const { request } = this.props;

		if (!request || !request.id) return false;

		if (values.items && values.items.length > 0) {
			const items: FoodLogItem[] = values.items.map((item: FoodLogItem) => {
				return {
					name: item.name,
					weight: item.weight,
				};
			});

			console.log("request id", request.id);
			console.log("items", items);

			// if (items.length > 0) {
			// 	const logData: FoodLogEntry = {
			// 		requestId: request.id,
			// 		items,
			// 	};

			// 	firebase
			// 		.firestore()
			// 		.collection("logs")
			// 		.add(logData)
			// 		.then(logRef => {
			// 			return firebase
			// 				.firestore()
			// 				.collection("requests")
			// 				.doc(request.id)
			// 				.update({});
			// 		})
			// 		.catch(error => {
			// 			message.error("Could not save food log");
			// 		});
			// }
		} else {
			message.error("Please enter at least 1 item");
			return false;
		}
	}

	render() {
		const { open, request } = this.props;

		if (!request) return null;

		const formId = "food-log-form";

		const buttonStyles = {
			marginLeft: 8,
		};

		const nameRules = [{ required: true, message: "Please enter a name" }];
		const weightRules = [
			{
				validator: (_: Rule, value: number) =>
					value && value > 0
						? Promise.resolve()
						: Promise.reject("Please enter a valid weight"),
			},
		];

		return (
			<Drawer
				visible={!!open}
				onClose={this.onClose}
				title="Entering Food Log"
				footer={
					<div style={{ textAlign: "right" }}>
						<Button onClick={this.onClose} style={buttonStyles}>
							Cancel
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							form={formId}
							style={buttonStyles}
						>
							Submit
						</Button>
					</div>
				}
			>
				<Form id={formId} onFinish={this.submitFoodLog}>
					<Row gutter={16}>
						<Col span={24}>
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
												rules={nameRules}
											>
												<Input placeholder="Food" />
											</Form.Item>
										</Col>

										<Col span={11}>
											<Form.Item
												name={[`${field.name}`, "weight"]}
												rules={weightRules}
											>
												<InputNumber
													formatter={value => `${value} lbs`}
													parser={value => `${value}`.replace(/[^\d.]/g, "")}
													placeholder="Weight (lbs)"
													style={{ width: "100%" }}
												/>
											</Form.Item>
										</Col>

										<Col span={2}>
											<Button
												type="link"
												onClick={() => remove(field.name)}
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
			</Drawer>
		);
	}
}

export default FoodLogDrawer;
