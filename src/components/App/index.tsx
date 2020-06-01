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
import FoodLogsView from "./FoodLogsView";
import { Helmet } from "react-helmet";
import { InferProps } from "prop-types";
import Loading from "./Loading";
import React from "react";
import { ThemeProvider } from "styled-components";
import { appTheme } from "../../utils/themes";
import firebase from "gatsby-plugin-firebase";

interface PageContentProps {
	siderVisible: 1 | 0;
}

interface AppState {
	agencies?: firebase.firestore.QuerySnapshot;
	agenciesLoading: boolean;
	agency?: firebase.firestore.QueryDocumentSnapshot;
	currentPage: PageIDs;
	loading: boolean;
	logs?: firebase.firestore.QuerySnapshot;
	logsLoading: boolean;
	mounted: boolean;
	requests?: firebase.firestore.QuerySnapshot;
	requestsLoading: boolean;
	settingAgenciesSnapshot: boolean;
	settingLogsSnapshot: boolean;
	settingRequestsSnapshot: boolean;
	settingUmbrellaSnapshot: boolean;
	umbrella?: firebase.firestore.DocumentSnapshot;
	umbrellaLoading: boolean;
	user?: firebase.User;
	userData?: firebase.firestore.DocumentData;
	userLoading: boolean;
}

class App extends React.Component<InferProps<typeof App.propTypes>, AppState> {
	static propTypes = {};

	constructor(props: InferProps<typeof App.propTypes>) {
		super(props);

		this.agenciesSnapshot = this.agenciesSnapshot.bind(this);
		this.changeView = this.changeView.bind(this);
		this.umbrellaSnapshot = this.umbrellaSnapshot.bind(this);

		this.state = {
			agenciesLoading: true,
			currentPage: PageIDs.CALENDAR,
			loading: true,
			logsLoading: true,
			mounted: false,
			requestsLoading: true,
			settingAgenciesSnapshot: false,
			settingLogsSnapshot: false,
			settingRequestsSnapshot: false,
			settingUmbrellaSnapshot: false,
			umbrellaLoading: true,
			userLoading: true,
		};
	}

	static defaultListener(): void {
		return void 0;
	}

	authListener(): void {
		return App.defaultListener();
	}

	agenciesSnapshot(): void {
		return App.defaultListener();
	}

	logsSnapshot(): void {
		return App.defaultListener();
	}

	requestsSnapshot(): void {
		return App.defaultListener();
	}

	umbrellaSnapshot(): void {
		return App.defaultListener();
	}

	logOut() {
		firebase.auth().signOut();
	}

	resetSnapshots() {
		this.agenciesSnapshot();
		this.agenciesSnapshot = App.defaultListener;

		this.requestsSnapshot();
		this.requestsSnapshot = App.defaultListener;

		this.logsSnapshot();
		this.logsSnapshot = App.defaultListener;

		this.umbrellaSnapshot();
		this.umbrellaSnapshot = App.defaultListener;

		this.setState({ agency: undefined });
	}

	changeView(id: PageIDs) {
		this.setState({ currentPage: id });
	}

	componentDidMount() {
		const setState = this.setState.bind(this);

		setState({ mounted: true });

		this.authListener = firebase.auth().onAuthStateChanged(newUser => {
			this.agenciesSnapshot();
			this.umbrellaSnapshot();

			this.setState({
				agencies: undefined,
				agenciesLoading: true,
				logs: undefined,
				logsLoading: true,
				requests: undefined,
				requestsLoading: true,
				umbrella: undefined,
				umbrellaLoading: true,
				user: newUser || undefined,
			});

			if (newUser) {
				// Is new user
				firebase
					.firestore()
					.collection("users")
					.doc(newUser.uid)
					.get()
					.then(userDoc => {
						if (this.state.mounted) {
							this.setState({ userData: userDoc.data(), userLoading: false });
						}
					});
			} else {
				this.setState({
					agenciesLoading: false,
					logsLoading: false,
					requestsLoading: false,
					umbrellaLoading: false,
					userLoading: false,
				});
			}
		});
	}

	componentDidUpdate(
		_prevProps: InferProps<typeof App.propTypes>,
		prevState: AppState
	) {
		if (
			this.state.loading &&
			!this.state.userLoading &&
			!this.state.umbrellaLoading &&
			!this.state.agenciesLoading &&
			!this.state.requestsLoading &&
			!this.state.logsLoading
		) {
			this.setState({ loading: false });
		} else if (
			!this.state.loading &&
			(this.state.userLoading ||
				this.state.umbrellaLoading ||
				this.state.agenciesLoading ||
				this.state.requestsLoading ||
				this.state.logsLoading)
		) {
			this.setState({ loading: true });
		}

		if (
			(this.state.user && !prevState.user) ||
			(this.state.user &&
				prevState.user &&
				this.state.user.uid !== prevState.user.uid)
		) {
			this.resetSnapshots();
		}

		if (!this.state.user && prevState.user) {
			this.resetSnapshots();
		}

		if (
			this.state.user &&
			this.state.userData &&
			!this.state.umbrella &&
			this.state.umbrellaLoading &&
			!this.state.settingUmbrellaSnapshot
		) {
			this.setState({ settingUmbrellaSnapshot: true });

			const userId = this.state.user.uid;

			this.umbrellaSnapshot = firebase
				.firestore()
				.collection("umbrellas")
				.doc(this.state.userData.umbrella)
				.onSnapshot(umbrellaDoc => {
					if (this.state.mounted && this.state.user?.uid === userId) {
						this.setState({
							settingUmbrellaSnapshot: false,
							umbrella: umbrellaDoc,
							umbrellaLoading: false,
						});
					} else if (this.state.mounted) {
						this.setState({ settingUmbrellaSnapshot: false });
					}
				});
		}

		if (
			this.state.user &&
			this.state.userData &&
			this.state.umbrella &&
			!this.state.agencies &&
			this.state.agenciesLoading &&
			!this.state.settingAgenciesSnapshot
		) {
			this.setState({ settingAgenciesSnapshot: true });

			const userId = this.state.user.uid;

			this.agenciesSnapshot = firebase
				.firestore()
				.collection("agencies")
				.where("umbrella", "==", this.state.umbrella.id)
				.onSnapshot(snapshot => {
					if (this.state.mounted && this.state.user?.uid === userId) {
						this.setState({
							settingAgenciesSnapshot: false,
							agencies: snapshot,
							agenciesLoading: false,
						});
					} else if (this.state.mounted) {
						this.setState({ settingAgenciesSnapshot: false });
					}
				});
		}

		if (
			(
				this.state.user &&
				this.state.userData &&
				this.state.umbrella &&
				this.state.agencies &&
				!this.state.agency
			) ||
			(
				this.state.agency &&
				this.state.agencies &&
				(
					!prevState.agencies ||
					!this.state.agencies.isEqual(prevState.agencies)
				)
			)
		) {
			this.setState({
				agency: this.state.agencies.docs.filter(
					x => x.id === this.state.userData?.agency
				)[0],
			});
		}

		if (
			this.state.user &&
			this.state.userData &&
			this.state.umbrella &&
			this.state.agencies &&
			this.state.agency &&
			!this.state.requests &&
			this.state.requestsLoading &&
			!this.state.settingRequestsSnapshot
		) {
			this.setState({ settingRequestsSnapshot: true });

			const userId = this.state.user.uid;

			switch (this.state.agency.data()?.type) {
				case AgencyTypes.DONATOR:
					this.requestsSnapshot = firebase
						.firestore()
						.collection("requests")
						.where("umbrella", "==", this.state.umbrella.id)
						.where("donator", "==", this.state.agency.id)
						.onSnapshot(snapshot => {
							if (this.state.mounted && this.state.user?.uid === userId) {
								this.setState({
									requests: snapshot,
									requestsLoading: false,
									settingRequestsSnapshot: false,
								});
							} else if (this.state.mounted) {
								this.setState({ settingRequestsSnapshot: false });
							}
						});
					break;

				case AgencyTypes.RECEIVER:
					console.log("we have receiver!");
					this.requestsSnapshot = firebase
						.firestore()
						.collection("requests")
						.where("umbrella", "==", this.state.umbrella.id)
						.where("receiver", "in", [this.state.agency.id, AgencyTypes.ANY])
						.onSnapshot(snapshot => {
							if (this.state.mounted && this.state.user?.uid === userId) {
								this.setState({
									requests: snapshot,
									requestsLoading: false,
									settingRequestsSnapshot: false,
								});
							} else if (this.state.mounted) {
								this.setState({ settingRequestsSnapshot: false });
							}
						});
					break;

				case AgencyTypes.DELIVERER:
					this.requestsSnapshot = firebase
						.firestore()
						.collection("requests")
						.where("umbrella", "==", this.state.umbrella.id)
						.where("deliverer", "in", [this.state.agency.id, AgencyTypes.ANY])
						.onSnapshot(snapshot => {
							if (this.state.mounted && this.state.user?.uid === userId) {
								this.setState({
									requests: snapshot,
									requestsLoading: false,
									settingRequestsSnapshot: false,
								});
							} else if (this.state.mounted) {
								this.setState({ settingRequestsSnapshot: false });
							}
						});
					break;
			}
		}

		if (
			this.state.user &&
			this.state.userData &&
			this.state.umbrella &&
			this.state.agencies &&
			this.state.agency &&
			!this.state.logs &&
			this.state.logsLoading &&
			!this.state.settingLogsSnapshot
		) {
			this.setState({ settingLogsSnapshot: true });

			const agencyId = this.state.agency.id;

			this.logsSnapshot = firebase
				.firestore()
				.collection("logs")
				.orderBy("date")
				.onSnapshot(snapshot => {
					if (this.state.mounted && agencyId === this.state.agency?.id) {
						this.setState({
							settingLogsSnapshot: false,
							logs: snapshot,
							logsLoading: false,
						});
					} else if (this.state.mounted) {
						this.setState({ settingLogsSnapshot: false });
					}
				});
		}
	}

	componentWillUnmount() {
		this.authListener();
		this.authListener = App.defaultListener;

		this.setState({ mounted: false });
	}

	render() {
		const {
			agencies,
			agency,
			currentPage,
			loading,
			logs,
			requests,
			umbrella,
			user,
		} = this.state;

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
			[PageIDs.FOODLOGS]: <FoodLogsView />,
		};

		const appContext: AppContextInterface = {
			agency,
			agencies,
			logs,
			requests,
			umbrella,
			user,
		};

		return (
			<ThemeProvider theme={appTheme}>
				<AppContext.Provider value={appContext}>
					<Helmet>
						<html lang="en" />
						<title>
							{user ? `${AppPages[currentPage].title} | Meal Matchup` : "Welcome to Meal Matchup"}
						</title>
					</Helmet>

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
