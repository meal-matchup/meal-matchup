import React from "react";
import PropTypes from "prop-types";
import { AgencyTypes } from "../../Enums";
import { Card, Descriptions } from "antd";

function FoodLogsCard({ date }) {
	const gridStyle = {
		height: "100%",
		width: "50%",
	};

	return (
		<Card size="small" title={"Delivery Completed " + date}>
			<Card.Grid style={gridStyle} hoverable={false}>
				<div>some stuff</div>
			</Card.Grid>
			<Card.Grid style={gridStyle} hoverable={false}>
				<div>some stuff</div>
			</Card.Grid>
			<Card.Grid style={gridStyle} hoverable={false}>
				<div>some stuff</div>
			</Card.Grid>
			<Card.Grid style={gridStyle} hoverable={false}>
				<div>some stuff</div>
			</Card.Grid>
			<Card.Grid style={gridStyle} hoverable={false}>
				<div>some stuff</div>
			</Card.Grid>
			<Card.Grid style={gridStyle} hoverable={false}>
				<div>some stuff</div>
			</Card.Grid>
		</Card>
	);
}

FoodLogsCard.propTypes = {};

export default FoodLogsCard;
