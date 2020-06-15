import { Button, Col, Form, Input, Row, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes, { InferProps } from "prop-types";
import React, { useEffect, useState } from "react";
import { AgencyUser } from "../../../../utils/enums";
import Debug from "debug";
import { Store } from "antd/lib/form/interface";
import firebase from "gatsby-plugin-firebase";

const debug = Debug("http");

interface EditDeliverersInitialValues {
	[id: string]: AgencyUser;
}

/**
 * Uses a functional component as the ant.design hooks are easier to use than
 * messing with class components.
 *
 * @param orops Props as described
 */
function EditDeliverersForm({
	givenUsers = [],
	agencyId,
	formId,
	onFinish,
}: InferProps<typeof EditDeliverersForm.propTypes>) {
	const [users, setUsers] = useState(givenUsers || []);
	const [initialValues, setInitialValues] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [form] = Form.useForm();

	/** Gets the values for the deliverer fields */
	const getFieldValues = () => {
		const theValues: EditDeliverersInitialValues = {};
		users.forEach((user, index) => {
			if (user) {
				theValues[`user${index}`] = {
					name: user.name,
					email: user.email,
				};
			}
		});
		return theValues;
	};

	/** Sets the initial values of the form when the items change */
	useEffect(() => {
		setInitialValues(getFieldValues());
	}, [users]);

	/** Sets the field values of the form when the initialValues change */
	useEffect(() => {
		form.setFieldsValue(initialValues);
	}, [form, initialValues]);

	const nameRules = [
		{
			required: true,
			message: "Please enter a name",
		},
	];
	const emailRules = [
		{
			required: true,
			message: "Please enter an email address",
		},
	];

	/**
	 * Updates the agencies users using the form data
	 *
	 * @param values An ant.design values store
	 */
	const submitForm = (values: Store) => {
		if (!agencyId) return false;

		setSubmitting(true);

		const newUsers: AgencyUser[] = [];

		Object.keys(values).forEach(item => {
			if (item !== "deliverers") {
				newUsers.push({
					name: values[item].name,
					email: values[item].email,
				});
			}
		});

		values.deliverers?.forEach((deliverer: AgencyUser) => {
			newUsers.push({
				name: deliverer.name,
				email: deliverer.email,
			});
		});

		return firebase
			.firestore()
			.collection("agencies")
			.doc(agencyId)
			.update({
				users: newUsers,
			})
			.then(() => {
				setSubmitting(false);
				onFinish && onFinish();
			})
			.catch(error => {
				debug(error);
				message.error("Could not complete request");
				setSubmitting(false);
			});
	};

	return (
		<Form
			form={form}
			id={formId}
			onFinish={submitForm}
			initialValues={initialValues}
		>
			{users.map((_, index) => (
				<Row key={`user${index}`} gutter={16}>
					<Col span={11}>
						<Form.Item name={[`user${index}`, "name"]} rules={nameRules}>
							<Input disabled={submitting} placeholder="Name" />
						</Form.Item>
					</Col>

					<Col span={11}>
						<Form.Item name={[`user${index}`, "email"]} rules={emailRules}>
							<Input
								disabled={submitting}
								placeholder="Email address"
								type="email"
							/>
						</Form.Item>
					</Col>

					<Col span={2}>
						<Form.Item>
							<Button
								type="link"
								onClick={() => {
									const newUsers = [...users];
									newUsers.splice(index, 1);
									setUsers([...newUsers]);
								}}
								block
							>
								<MinusCircleOutlined />
							</Button>
						</Form.Item>
					</Col>
				</Row>
			))}

			<Form.List name="deliverers">
				{(fields, { add, remove }) => (
					<>
						{fields.map(field => (
							<Row key={field.key} gutter={16}>
								<Col span={11}>
									<Form.Item name={[field.name, "name"]} rules={nameRules}>
										<Input disabled={submitting} placeholder="Name" />
									</Form.Item>
								</Col>

								<Col span={11}>
									<Form.Item name={[field.name, "email"]} rules={emailRules}>
										<Input
											disabled={submitting}
											placeholder="Email address"
											type="email"
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
								Add Deliverer
							</Button>
						</Form.Item>
					</>
				)}
			</Form.List>
		</Form>
	);
}

EditDeliverersForm.propTypes = {
	givenUsers: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			email: PropTypes.string.isRequired,
		})
	),
	agencyId: PropTypes.string,
	formId: PropTypes.string.isRequired,
	onFinish: PropTypes.func,
};

export default EditDeliverersForm;
