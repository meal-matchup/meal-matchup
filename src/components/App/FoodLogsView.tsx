import { AppContext, AppPage } from "./";
import { Card, List, Statistic, Tabs } from "antd";
import React from "react";
import moment from "moment";

interface FoodItem {
	name: string;
	weight: number;
}

interface FoodItems {
	[name: string]: number;
}

class FoodLogsView extends React.Component {
	render() {
		return (
			<AppContext.Consumer>
				{appContext => {
					const food: FoodItems = {};

					appContext.logs?.docs.forEach(log => {
						log?.data()?.items?.forEach((item: FoodItem) => {
							if (food[item.name]) {
								food[item.name] = food[item.name] + item.weight;
							} else {
								food[item.name] = item.weight;
							}
						});
					});

					return (
						<AppPage id="FoodLogsView">
							<Tabs defaultActiveKey="1">
								<Tabs.TabPane key="1" tab="History">
									<List grid={{ column: 1, gutter: 16 }}>
										{appContext.logs?.docs.map(log => {
											const date = log.data()?.date
												? moment(log.data()?.date.toDate()).format(
														"MMMM D, YYYY"
												  )
												: "unknown";

											return (
												<List.Item key={log.id}>
													<Card size="small" title={`Donation on ${date}`}>
														{log.data()?.items?.map((item: FoodItem) => (
															<Card.Grid key={item.name} hoverable={false}>
																<Statistic
																	title={item.name}
																	value={item.weight}
																	precision={1}
																	suffix="lbs"
																/>
															</Card.Grid>
														))}
													</Card>
												</List.Item>
											);
										})}
									</List>
								</Tabs.TabPane>

								<Tabs.TabPane key="2" tab="Total Donations">
									<Card size="small" title="Items Donated">
										{Object.keys(food).map((item, index) => (
											<Card.Grid key={`${item} ${index}`} hoverable={false}>
												<Statistic
													title={item}
													value={food[item]}
													precision={1}
													suffix="lbs"
												/>
											</Card.Grid>
										))}
									</Card>
								</Tabs.TabPane>
							</Tabs>
						</AppPage>
					);
				}}
			</AppContext.Consumer>
		);
	}
}

export default FoodLogsView;
