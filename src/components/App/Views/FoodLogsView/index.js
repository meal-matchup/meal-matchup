import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Select, Tabs, Row } from 'antd';

import FoodLogsCard from './FoodLogsCard';

import { AgencyTypes } from '../../Enums';

const { TabPane } = Tabs;

function FoodLogsView() {
	const [filter, setFilter] = useState('ALL');

	const gridStyle = {
		height: '30%',
		width: '25%',
	};

	let food = [
		{ item: 'pickles', amount: 10 },
		{ item: 'fruit', amount: 25 },
		{ item: 'pizza', amount: 7 },
		{ item: 'pickles', amount: 10 },
		{ item: 'fruit', amount: 25 },
		{ item: 'pizza', amount: 7 },
	];

	return (
		<Tabs defaultActiveKey="1">
			<TabPane tab="History" key="1">
				<FoodLogsCard date="4/28/2020 4pm" />
			</TabPane>
			<TabPane tab="Total Donations" key="2">
				<div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							width: '70vw',
							maxWidth: 400,
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: 200,
							}}
						>
							<p style={{ fontSize: 30, paddingTop: 15 }}> 220</p>
							<p> Total Pounds Donated </p>
						</div>

						<Select
							defaultValue="ALL"
							style={{ width: 175, marginBottom: 12 }}
							onChange={setFilter}
						>
							<Select.Option value="ALL">All Time</Select.Option>
							<Select.Option value={'WEEK'}>Past Week</Select.Option>
							<Select.Option value={'MONTH'}>Past Month</Select.Option>
							<Select.Option value={'SIXMONTH'}>Past Six Months</Select.Option>
						</Select>
					</div>
					{food && (
						<Card size="small" title={'Items Donated	'}>
							{food.map((item) => {
								return (
									<Card.Grid
										style={gridStyle}
										key={item.item}
										hoverable={false}
									>
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'space-between',
												width: 200,
											}}
										>
											<div><b>{item.item}</b></div>
											<div>{`${item.amount}lbs`} </div>
										</div>
									</Card.Grid>
								);
							})}
						</Card>
					)}
				</div>
			</TabPane>
		</Tabs>
	);
}

FoodLogsView.propTypes = {};

export default FoodLogsView;
