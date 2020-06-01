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
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { FoodLogItem } from "../../../../utils/enums";
import { Rule } from "antd/lib/form";
import { Store } from "antd/lib/form/interface";
import firebase from "gatsby-plugin-firebase";
import moment from "moment";

interface FoodLogInitialValues {
	[id: string]: FoodLogItem;
}

interface FoodLogFormProps {
	formId: string;
	givenItems: FoodLogItem[];
	log?: firebase.firestore.DocumentSnapshot;
	occurrence?: firebase.firestore.QueryDocumentSnapshot;
	onFinish?: () => void;
	request?: firebase.firestore.QueryDocumentSnapshot;
}

function FoodLogForm({
	formId,
	givenItems = [],
	log,
	occurrence,
	onFinish,
	request,
}: FoodLogFormProps) {
	const [currentOccurrence, setCurrentOccurrence] = useState("");
	const [items, setItems] = useState(givenItems);
	const [initialValues, setInitialValues] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [form] = Form.useForm();

	const getFieldValues = () => {
		const theValues: FoodLogInitialValues = {};
		items.forEach((item, index) => {
			if (item) {
				theValues[`item${index}`] = {
					name: item.name,
					weight: item.weight,
				};
			}
		});
		return theValues;
	};

	useEffect(() => {
		setInitialValues(getFieldValues());
	}, [items]);

	useEffect(() => {
		form.setFieldsValue(initialValues);
	}, [form, initialValues]);

	useEffect(() => {
		if (occurrence && occurrence.id !== currentOccurrence) {
			setCurrentOccurrence(occurrence.id);
			setItems(givenItems);
		}
	}, [occurrence]);

	const nameRules = [{ required: true, message: "Please enter a name" }];

	const weightRules = [
		{
			validator: (_: Rule, value: number) =>
				value && value > 0
					? Promise.resolve()
					: Promise.reject("Please enter a valid weight"),
		},
	];

	const submitFoodLog = (values: Store) => {
		if (!occurrence || !request || (occurrence.data()?.logId && !log)) {
			return false;
		}

		setSubmitting(true);

		const logItems: FoodLogItem[] = [];

		Object.keys(values).forEach(item => {
			if (item !== "items") {
				logItems.push({
					name: values[item].name,
					weight: values[item].weight,
				});
			}
		});

		values.items?.forEach((item: FoodLogItem) => {
			logItems.push({
				name: item.name,
				weight: item.weight,
			});
		});

		const batch = firebase.firestore().batch();

		if (log) {
			// Has log, updated it
			batch.update(log.ref, {
				items: logItems,
			});
		} else {
			// Doesnt have log, create one
			const logRef = firebase.firestore().collection("logs").doc();
			batch.set(logRef, {
				date: occurrence.data()?.date.toDate(),
				items: logItems,
				requestId: request.id,
				occurrenceId: occurrence.id,
			});

			batch.update(occurrence.ref, {
				logId: logRef.id,
				complete: true,
			});

			const occurrenceDate = moment(occurrence.data()?.date.toDate());

			batch.update(request.ref, {
				completedDates: firebase.firestore.FieldValue.arrayUnion(
					occurrenceDate.format("YYYY MMMM D")
				),
			});
		}

		batch
			.commit()
			.then(() => {
				message.success("Successfully updated food log");
				setSubmitting(false);
				if (onFinish) onFinish();
			})
			.catch(() => {
				message.error("Could not update food log");
			});
	};

	return (
		<Form
			form={form}
			id={formId}
			initialValues={initialValues}
			onFinish={submitFoodLog}
		>
			<Row gutter={16}>
				<Col span={24}>
					<p>
						Make sure to enter the name and approximate weight (in pounds) of
						every item related to this delivery.
					</p>
				</Col>
			</Row>

			<Divider />

			{items.map((_, index) => (
				<Row key={`user${index}`} gutter={16}>
					<Col span={11}>
						<Form.Item name={[`item${index}`, "name"]} rules={nameRules}>
							<Input disabled={submitting} placeholder="Food" />
						</Form.Item>
					</Col>

					<Col span={11}>
						<Form.Item name={[`item${index}`, "weight"]} rules={weightRules}>
							<InputNumber
								formatter={value => `${value} lbs`}
								parser={value => `${value}`.replace(/[^\d.]/g, "")}
								placeholder="Weight (lbs)"
								style={{ width: "100%" }}
							/>
						</Form.Item>
					</Col>

					<Col span={2}>
						<Form.Item>
							<Button
								type="link"
								onClick={() => {
									const newItems = [...items];
									newItems.splice(index, 1);
									setItems([...newItems]);
								}}
								block
							>
								<MinusCircleOutlined />
							</Button>
						</Form.Item>
					</Col>
				</Row>
			))}

			<Form.List name="items">
				{(fields, { add, remove }) => (
					<>
						{fields.map(field => (
							<Row key={field.key} gutter={16}>
								<Col span={11}>
									<Form.Item name={[`${field.name}`, "name"]} rules={nameRules}>
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
									<Button type="link" onClick={() => remove(field.name)} block>
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
	);
}

export default FoodLogForm;
