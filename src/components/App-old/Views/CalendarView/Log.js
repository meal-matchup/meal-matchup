import React, { useState } from "react";
import PropTypes from "prop-types";
import firebase from "gatsby-plugin-firebase";
import moment from "moment";
import {
	AutoComplete,
	Button,
	Col,
	DatePicker,
	Divider,
	Drawer,
	Form,
	InputNumber,
	Radio,
	Row,
	Select,
	TimePicker,
} from "antd";

import { AgencyTypes, RequestTypes } from "../../Enums";

function Log({ open = false, onClose, request, occurrence }) {
	const [numItems, setNumItems] = useState(1);

	const today = new Date();

	let rows = [];
	for (let i = 0; i < numItems; i++) {
		rows.push(
			<Row gutter={16} key={`row-${i}`}>
				<Col span={12}>
					<Form.Item name={["item", i]} label="Item">
						<AutoComplete
							options={[
								{
									value: "hamburger meat",
								},
								{
									value: "peas",
								},
							]}
							filterOption={(inputValue, option) =>
								option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
								-1
							}
						/>
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item name={("weight", i)} label="Weight (approximate, in lbs)">
						<InputNumber style={{ width: "100%" }} />
					</Form.Item>
				</Col>
			</Row>
		);
	}

	const closeDrawer = () => {
		onClose();
	};

	return (
		<Drawer
			className="drawer"
			title="Complete a delivery"
			visible={open && occurrence && occurrence.date.toDate() <= today}
			onClose={closeDrawer}
			footer={
				<div style={{ textAlign: "right" }}>
					<Button>Cancel</Button>
				</div>
			}
		>
			<Form layout="vertical">
				<Row gutter={16}>
					<Col span={24}>
						<p>Please fill out the food log for the donation here.</p>
					</Col>
				</Row>

				<Divider />

				{rows}

				<Button onClick={() => setNumItems(numItems + 1)}>Add item</Button>
			</Form>
		</Drawer>
	);
}

Log.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	request: PropTypes.shape({}),
	occurrence: PropTypes.shape({
		date: PropTypes.object.isRequired,
		completed: PropTypes.bool,
	}),
};

export default Log;
