import {
	AgencyTypes,
	AppContextInterface,
	AppPages,
	AppViewsInterface,
	MenuLocations,
	PageIDs,
} from "../../utils/enums";
import { Layout, Menu, PageHeader } from "antd";
import AccountView from "./AccountView";
import { AnimatePresence } from "framer-motion";
import AppContext from "./AppContext";
import AppPage from "./AppPage";
import Auth from "./Auth";
import CalendarView from "./CalendarView";
import DirectoryView from "./DirectoryView";
import Drawer from "./Drawer";
import { InferProps } from "prop-types";
import Loading from "./Loading";
import React from "react";
import { ThemeProvider } from "styled-components";
import { appTheme } from "../../utils/themes";
import debug from "../../utils/debug";
import firebase from "gatsby-plugin-firebase";

interface PageContentProps {
	siderVisible: 1 | 0;
}

interface AppState {
	loading: boolean;
	mounted: boolean;
	user?: firebase.User;
	userData?: firebase.firestore.DocumentData;
	userLoading: boolean;
	umbrella?: firebase.firestore.DocumentSnapshot;
	umbrellaLoading: boolean;
	gettingAgencies: boolean;
	agencies?: firebase.firestore.QuerySnapshot;
	agenciesLoading: boolean;
	agency?: firebase.firestore.DocumentSnapshot;
	agencyLoading: boolean;
	requests?: firebase.firestore.QuerySnapshot;
	requestsLoading: boolean;
	currentPage: PageIDs;
}

/** App component */
class App extends React.Component<InferProps<typeof App.propTypes>, AppState> {
	static propTypes = {};

	constructor(props: InferProps<typeof App.propTypes>) {
		super(props);

		this.state = {
			loading: true,
			mounted: true,
			user: undefined,
			userLoading: true,
			umbrellaLoading: true,
			gettingAgencies: false,
			agenciesLoading: true,
			agencyLoading: true,
			requestsLoading: true,
			currentPage: PageIDs.CALENDAR,
		};

		// this.getAgencies = this.getAgencies.bind(this);
		// this.getRequests = this.getRequests.bind(this);
		// this.setState = this.setState.bind(this);
	}

	umbrellaSnapshot(): void {
		debug.error("No umbrella snapshot");
	}

	agencySnapshot(): void {
		debug.error("No agency snapshot");
	}

	agenciesSnapshot(): void {
		debug.error("No agencies snapshot");
	}

	requestsSnapshot(): void {
		debug.error("No requests snapshot");
	}

	async getAgencies() {
		const { mounted, umbrella } = this.state;
		if (!umbrella?.data()) return;

		const setState = this.setState.bind(this);

		setState({ gettingAgencies: true });

		this.agenciesSnapshot = firebase
			.firestore()
			.collection("agencies")
			.where("umbrella", "==", umbrella.id)
			.onSnapshot(snapshot => {
				if (mounted) {
					setState({
						agencies: snapshot,
						agenciesLoading: false,
						gettingAgencies: false,
					});
				}
			});
	}

	async getRequests() {
		const { umbrella, agency, mounted } = this.state;
		if (!umbrella?.data() || !agency?.data()) return false;

		const setState = this.setState.bind(this);

		switch (agency.data()?.type) {
			case AgencyTypes.DONATOR:
				this.requestsSnapshot = firebase
					.firestore()
					.collection("requests")
					.where("umbrella", "==", umbrella.id)
					.where("donator", "==", agency.id)
					.onSnapshot(snapshot => {
						if (mounted) {
							setState({
								requests: snapshot,
								requestsLoading: false,
							});
						}
					});
				return true;

			case AgencyTypes.RECEIVER:
				this.requestsSnapshot = firebase
					.firestore()
					.collection("requests")
					.where("umbrella", "==", umbrella.id)
					.where("receiver", "==", agency.id)
					.onSnapshot(snapshot => {
						if (mounted) {
							setState({
								requests: snapshot,
								requestsLoading: false,
							});
						}
					});
				return true;

			case AgencyTypes.DELIVERER:
				this.requestsSnapshot = firebase
					.firestore()
					.collection("requests")
					.where("umbrella", "==", umbrella.id)
					.where("deliverer", "in", [agency.id, AgencyTypes.ANY])
					.onSnapshot(snapshot => {
						if (mounted) {
							setState({
								requests: snapshot,
								requestsLoading: false,
							});
						}
					});
				return true;

			default:
				return false;
		}
	}

	componentDidUpdate(_: InferProps<typeof App.propTypes>, prevState: AppState) {
		const { mounted } = this.state;

		const setState = this.setState.bind(this);

		// Get all agencies if the umbrella changes or if there are no agencies
		if (
			this.state.umbrella &&
			!this.state.gettingAgencies &&
			(this.state.umbrella !== prevState.umbrella || !this.state.agencies)
		) {
			this.getAgencies();
		}

		if (this.state.umbrella && this.state.agency && !this.state.requests) {
			this.getRequests();
		}

		if (
			this.state.loading &&
			!this.state.umbrellaLoading &&
			!this.state.agenciesLoading &&
			!this.state.agencyLoading &&
			!this.state.requestsLoading
		) {
			this.setState({ loading: false });
		}

		if (
			this.state.user &&
			this.state.userData &&
			(!prevState.user || !prevState.userData)
		) {
			this.umbrellaSnapshot = firebase
				.firestore()
				.collection("umbrellas")
				.doc(this.state.userData.umbrella)
				.onSnapshot(umbrellaDoc => {
					if (mounted) {
						setState({
							umbrella: umbrellaDoc,
							umbrellaLoading: false,
						});
					}
				});

			this.agencySnapshot = firebase
				.firestore()
				.collection("agencies")
				.doc(this.state.userData.agency)
				.onSnapshot(agencyDoc => {
					if (mounted) {
						setState({
							agency: agencyDoc,
							agencyLoading: false,
						});
					}
				});
		}
	}

	// Handle what happens after the component mounts
	componentDidMount() {
		// Handle what happens when the user logs in our out
		firebase.auth().onAuthStateChanged(newUser => {
			this.umbrellaSnapshot();
			this.agencySnapshot();
			this.agenciesSnapshot();
			this.requestsSnapshot();

			this.umbrellaSnapshot = () => debug.error("No umbrella snapshot");
			this.agencySnapshot = () => debug.error("No agency snapshot");
			this.agenciesSnapshot = () => debug.error("No agencies snapshot");
			this.requestsSnapshot = () => debug.error("No requests snapshot");

			const setState = this.setState.bind(this);

			setState({ user: newUser || undefined, userLoading: false });
			if (newUser) {
				setState({
					umbrellaLoading: true,
					umbrella: undefined,
					agenciesLoading: true,
					agencies: undefined,
					agencyLoading: true,
					agency: undefined,
					requestsLoading: true,
					requests: undefined,
				});

				firebase
					.firestore()
					.collection("users")
					.doc(newUser.uid)
					.get()
					.then(userDoc => {
						setState({ userData: userDoc.data() });
					})
					.catch(error => {
						debug.error(error);
					});
			} else {
				setState({
					umbrella: undefined,
					umbrellaLoading: false,
					agencies: undefined,
					agenciesLoading: false,
					agency: undefined,
					agencyLoading: false,
					requests: undefined,
					requestsLoading: false,
				});
			}
		});
	}

	componentWillUnmount() {
		this.setState({ mounted: false });
	}

	changeView(id: PageIDs) {
		this.setState({
			currentPage: id,
		});
	}

	logOut() {
		if (firebase) {
			firebase.auth().signOut();
		}
	}

	render() {
		const appViews: AppViewsInterface = {
			[PageIDs.CALENDAR]: (
				<AppContext.Consumer>
					{appContext => (
						<CalendarView
							agency={appContext.agency}
							requests={appContext.requests}
						/>
					)}
				</AppContext.Consumer>
			),
			[PageIDs.DIRECTORY]: <DirectoryView />,
			[PageIDs.ACCOUNT]: <AccountView />,
		};

		const { currentPage, loading, user } = this.state;

		const appContext: AppContextInterface = {
			user: this.state.user,
			umbrella: this.state.umbrella,
			agencies: this.state.agencies,
			agency: this.state.agency,
			requests: this.state.requests,
		};

		return (
			<ThemeProvider theme={appTheme}>
				<AppContext.Provider value={appContext}>
					<Loading loading={loading} />

					<Layout>
						{user && (
							<Layout.Sider
								style={{
									overflow: "auto",
									height: "100%",
									position: "fixed",
									left: 0,
									zIndex: 8,
								}}
							>
								<div
									style={{
										alignItems: "center",
										boxSizing: "border-box",
										color: "#fff",
										display: "flex",
										fontSize: "1.6em",
										height: "88px",
										justifyContent: "center",
										padding: "16px",
									}}
								>
									Meal Matchup
								</div>
								<Menu theme="dark" selectedKeys={[`${currentPage}`]}>
									{Object.keys(AppPages).map(pageID => {
										const page = AppPages[pageID];
										if (page.location === MenuLocations.SIDER) {
											return (
												<Menu.Item
													key={page.id}
													onClick={() => this.changeView(page.id)}
												>
													{page.icon && page.icon}
													{page.title}
												</Menu.Item>
											);
										}
									})}
								</Menu>
							</Layout.Sider>
						)}

						<Layout
							style={{
								backgroundColor: "#fff",
								marginLeft: user ? 200 : 0,
							}}
						>
							<Layout.Content>
								{user && (
									<PageHeader
										title={AppPages[currentPage].title}
										ghost={false}
										style={{
											boxShadow: "0 0 1px rgba(0, 0, 0, 0.1)",
											position: "fixed",
											right: 0,
											top: 0,
											width: user ? "calc(100% - 200px)" : "100%",
											zIndex: 7,
										}}
										extra={[
											<Menu
												key="PageHeader-Menu"
												mode="horizontal"
												selectedKeys={[`${currentPage}`]}
											>
												{Object.keys(AppPages).map(pageID => {
													const page = AppPages[pageID];
													if (page.location === MenuLocations.HEADER) {
														return (
															<Menu.Item
																key={page.id}
																onClick={() => this.changeView(page.id)}
															>
																{page.icon && page.icon}
																{page.title}
															</Menu.Item>
														);
													}
												})}
												<Menu.Item onClick={this.logOut}>Log Out</Menu.Item>
											</Menu>,
										]}
									/>
								)}

								<div style={{ marginTop: "88px", padding: "16px 24px" }}>
									<AnimatePresence exitBeforeEnter>
										{user ? appViews[currentPage] : <Auth />}
									</AnimatePresence>
								</div>
							</Layout.Content>
						</Layout>
					</Layout>
				</AppContext.Provider>
			</ThemeProvider>
		);
	}
}

export default App;

export { AppContext, AppPage, Drawer };
