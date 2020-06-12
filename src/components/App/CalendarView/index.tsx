import {
	AgencyTypes,
	RequestTypeNames,
	RequestTypes,
} from "../../../utils/enums";
import { AppContext, AppPage } from "../";
import { Badge, Button, Calendar, Tabs, Tooltip } from "antd";
import ExistingRequestDrawer from "./ExistingRequestDrawer";
import NewRequestDrawer from "./NewRequestDrawer";
import React from "react";
import firebase from "gatsby-plugin-firebase";
import { isSameWeekdayInPeriod } from "../../../utils/functions";
import moment from "moment";

interface CalendarViewProps {
	userData?: firebase.firestore.DocumentData;
	requests?: firebase.firestore.QuerySnapshot;
	agency?: firebase.firestore.DocumentSnapshot;
}

interface CalendarViewState {
	currentRequest?: firebase.firestore.QueryDocumentSnapshot;
	mounted: boolean;
	requests?: firebase.firestore.QuerySnapshot;
	newRequestDrawerOpen: boolean;
	existingRequestDrawerOpen: boolean;
	logDrawerOpen: boolean;
	selectedDate: moment.Moment;
}

class CalendarView extends React.Component<
	CalendarViewProps,
	CalendarViewState
> {
	/** Initialize the calendar view */
	constructor(props: CalendarViewProps) {
		super(props);

		this.dateCellRender = this.dateCellRender.bind(this);
		this.toggleNewRequestDrawer = this.toggleNewRequestDrawer.bind(this);
		this.openExistingRequestDrawer = this.openExistingRequestDrawer.bind(this);
		this.toggleExistingRequestDrawer = this.toggleExistingRequestDrawer.bind(
			this
		);

		this.state = {
			mounted: false,
			newRequestDrawerOpen: false,
			existingRequestDrawerOpen: false,
			logDrawerOpen: false,
			selectedDate: moment(),
		};
	}

	/** Runs when the component props or state changes. */
	componentDidUpdate(prevProps: CalendarViewProps) {
		/**
		 * If there are requests and the requests have changed, then we can updated
		 * the state of the current request as it might have changed
		 */
		if (
			this.props.requests &&
			prevProps.requests &&
			!this.props.requests.isEqual(prevProps.requests) &&
			this.state.currentRequest
		) {
			this.setState({
				currentRequest: this.props.requests?.docs.filter(
					x => x.id === this.state.currentRequest?.id
				)[0],
			});
		}
	}

	/**
	 * Takes a date and determines what to render in the calendar for that date
	 *
	 * @param date The date of the calendar which we are rendering in
	 */
	dateCellRender(date: moment.Moment): React.ReactNode {
		const { agency, userData } = this.props;

		const requestsOnDate = this.props.requests?.docs.filter(x =>
			isSameWeekdayInPeriod(
				x.data().dates.from.toDate(),
				x.data().dates.to.toDate(),
				date.toDate()
			)
		);

		if (requestsOnDate && requestsOnDate.length > 0) {
			return (
				<ul
					style={{
						listStyle: "none",
						margin: 0,
						padding: 0,
					}}
				>
					{requestsOnDate.map(request => {
						let status:
							| "default"
							| "warning"
							| "success"
							| "processing"
							| "error" = "default";

						if (userData?.admin === true) {
							if (
								request.data()?.deliverer !== AgencyTypes.ANY &&
								request.data()?.receiver !== AgencyTypes.ANY
							)
								status = "warning";
						} else if (!agency) {
							return null;
						} else {
							if (request.data().type === RequestTypes.PICKUP) {
								if (
									(agency.data()?.type === AgencyTypes.DONATOR &&
										request.data().deliverer !== AgencyTypes.ANY) ||
									request.data()[agency.data()?.type.toLowerCase()] !==
										AgencyTypes.ANY
									//  && !occurrence?.complete)
								) {
									status = "warning";
								}
							} else {
								if (request.data().deliverer !== AgencyTypes.ANY) {
									status = "warning";
								}
							}
						}

						if (
							request
								.data()
								?.completedDates?.indexOf(date.format("YYYY MMMM D")) > -1
						) {
							status = "success";
						}

						return (
							<li key={request.id}>
								<Button
									type="link"
									onClick={() => this.openExistingRequestDrawer(request)}
									style={{
										color: "inherit",
										margin: 0,
										padding: 0,
										textAlign: "left",
									}}
									block
								>
									<Badge
										status={status}
										text={RequestTypeNames[request.data().type]}
										style={{
											fontSize: "12px",
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
											width: "100%",
										}}
									/>
								</Button>
							</li>
						);
					})}
				</ul>
			);
		}

		return null;
	}

	/** Toggles the new request drawer between open and closed */
	toggleNewRequestDrawer() {
		this.setState({ newRequestDrawerOpen: !this.state.newRequestDrawerOpen });
	}

	/**
	 * Opens the existing request drawer if there is a request
	 *
	 * @param request A firebase query document snapshot
	 */
	openExistingRequestDrawer(request: firebase.firestore.QueryDocumentSnapshot) {
		if (request) {
			this.setState({
				currentRequest: request,
				existingRequestDrawerOpen: true,
			});
		}
	}

	/** Toggles the existing request drawer */
	toggleExistingRequestDrawer() {
		this.setState({
			existingRequestDrawerOpen: !this.state.existingRequestDrawerOpen,
		});
	}

	/** Renders the calendar view */
	render() {
		const {
			newRequestDrawerOpen,
			existingRequestDrawerOpen,
			currentRequest,
			selectedDate,
		} = this.state;

		return (
			<AppContext.Consumer>
				{appContext => (
					<AppPage id="DirectoryView">
						<NewRequestDrawer
							open={newRequestDrawerOpen}
							onClose={this.toggleNewRequestDrawer}
							umbrellaId={appContext.umbrella?.id}
							agencyId={appContext.agency?.id}
						/>

						<ExistingRequestDrawer
							open={existingRequestDrawerOpen}
							onClose={this.toggleExistingRequestDrawer}
							request={currentRequest}
							date={selectedDate}
							agencies={appContext.agencies}
							agency={appContext.agency}
							userData={appContext.userData}
						/>

						{appContext.agency?.data()?.type === AgencyTypes.DONATOR && (
							<div
								style={{
									bottom: "2em",
									display: "flex",
									position: "fixed",
									right: "2em",
									zIndex: 3,
								}}
							>
								<Tooltip
									title={
										!appContext.agency?.data()?.approved &&
										"Your account has not been approved yet"
									}
									placement="topRight"
								>
									<Button
										disabled={!appContext.agency?.data()?.approved}
										type="primary"
										onClick={this.toggleNewRequestDrawer}
									>
										New Request
									</Button>
								</Tooltip>
							</div>
						)}

						<Tabs defaultActiveKey="2">
							<Tabs.TabPane tab="Calendar" key="1">
								<h2>{selectedDate.format("MMMM YYYY")}</h2>

								<Calendar
									dateCellRender={this.dateCellRender}
									onChange={value => this.setState({ selectedDate: value })}
								/>
							</Tabs.TabPane>

							<Tabs.TabPane tab="List" key="2">
								List
							</Tabs.TabPane>
						</Tabs>
					</AppPage>
				)}
			</AppContext.Consumer>
		);
	}
}

export default CalendarView;
