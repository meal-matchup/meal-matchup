import { AppContext, AppPage } from "./";
import { Card, Empty, List, Statistic, Tabs } from "antd";
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

					let totalDontaionWeight = 0;

					appContext.logs?.docs.forEach(log => {
						const logRequest = appContext.requests?.docs.filter(
							x => x.id === log?.data()?.requestId
						)[0];

						if (appContext.userData?.admin !== true) {
							// not umbrella, so they must be related
							if (!logRequest) return false;
							const agencyType = appContext.agency?.data()?.type;
							if (!agencyType) return false;
							const agencyTypeKey = `${agencyType}`.toLocaleLowerCase();
							const logRequestData = logRequest.data();
							if (!logRequestData) return false;
							if (logRequestData[agencyTypeKey] !== appContext.agency?.id)
								return false;
						}

						log?.data()?.items?.forEach((item: FoodItem) => {
							if (food[item.name]) {
								food[item.name] = food[item.name] + item.weight;
							} else {
								food[item.name] = item.weight;
							}

							totalDontaionWeight = totalDontaionWeight + item.weight;
						});
					});

					return (
						<AppPage id="FoodLogsView">
							<Tabs defaultActiveKey="1">
								<Tabs.TabPane key="1" tab="History">
									<List grid={{ column: 1, gutter: 16 }}>
										{appContext.logs?.docs.map(log => {
											const logRequest = appContext.requests?.docs.filter(
												x => x.id === log?.data()?.requestId
											)[0];

											if (appContext.userData?.admin !== true) {
												// not umbrella, so they must be related
												if (!logRequest) return false;
												const agencyType = appContext.agency?.data()?.type;
												if (!agencyType) return false;
												const agencyTypeKey = `${agencyType}`.toLocaleLowerCase();
												const logRequestData = logRequest.data();
												if (!logRequestData) return false;
												if (
													logRequestData[agencyTypeKey] !==
													appContext.agency?.id
												)
													return false;
											}

											const date = log.data()?.date
												? moment(log.data()?.date.toDate()).format(
														"MMMM D, YYYY"
												  )
												: "unknown";
											let totalWeight = 0;
											log.data()?.items?.forEach((item: FoodItem) => {
												totalWeight = totalWeight + item.weight;
											});

											return (
												<List.Item key={log.id}>
													<Card
														size="small"
														title={`Donation on ${date}`}
														extra={`Total: ${totalWeight} lbs`}
													>
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

										{Object.keys(food).length === 0 && <Empty />}
									</List>
								</Tabs.TabPane>

								<Tabs.TabPane key="2" tab="Total Donations">
									<Card
										size="small"
										title="Items Donated"
										extra={`Total: ${totalDontaionWeight} lbs`}
									>
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

										{Object.keys(food).length === 0 && <Empty />}
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
