import {
	AgencyTypes,
	AppContextInterface,
	AppPages,
	AppViewsInterface,
	MenuLocations,
	PageIds,
} from "../../utils/enums";
import { Layout, Menu, PageHeader } from "antd";
import AccountView from "./AccountView";
import { AnimatePresence } from "framer-motion";
import AppContext from "./AppContext";
import AppPage from "./AppPage";
import Auth from "./Auth";
import CalendarView from "./CalendarView";
import Debug from "debug";
import DirectoryView from "./DirectoryView";
import Drawer from "./Drawer";
import FoodLogsView from "./FoodLogsView";
import { Helmet } from "react-helmet";
import Loading from "./Loading";
import React from "react";
import { ThemeProvider } from "styled-components";
import { appTheme } from "../../utils/themes";
import firebase from "gatsby-plugin-firebase";

const debug = Debug("http");

interface AppState {
	agencies?: firebase.firestore.QuerySnapshot;
	agenciesLoading: boolean;
	agency?: firebase.firestore.QueryDocumentSnapshot;
	currentPage: PageIds;
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

class App extends React.Component<React.ComponentProps<"div">, AppState> {
	/**
	 * Initializes the App
	 *
	 * @param props The props of the App
	 */
	constructor(props: React.ComponentProps<"div">) {
		super(props);

		this.agenciesSnapshot = this.agenciesSnapshot.bind(this);
		this.changeView = this.changeView.bind(this);
		this.umbrellaSnapshot = this.umbrellaSnapshot.bind(this);

		this.state = {
			agenciesLoading: true,
			currentPage: PageIds.CALENDAR,
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

	/** A void function used as a placeholder */
	static defaultListener(): void {
		debug("There is no listener");
		return void 0;
	}

	/** A function to be replaced by a firebase snapsot listener */
	authListener(): void {
		return App.defaultListener();
	}

	/** A function to be replaced by a firebase snapsot listener */
	agenciesSnapshot(): void {
		return App.defaultListener();
	}

	/** A function to be replaced by a firebase snapsot listener */
	logsSnapshot(): void {
		return App.defaultListener();
	}

	/** A function to be replaced by a firebase snapsot listener */
	requestsSnapshot(): void {
		return App.defaultListener();
	}

	/** A function to be replaced by a firebase snapsot listener */
	umbrellaSnapshot(): void {
		return App.defaultListener();
	}

	/** Logs the user out of firebase */
	logOut() {
		firebase.auth().signOut();
	}

	/** Calls the snapshot listener functions to end them, then resets them */
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

	/**
	 * Changes the app's current view
	 *
	 * @param id THe ID of the page to switch to
	 */
	changeView(id: PageIds) {
		this.setState({ currentPage: id });
	}

	/** "Mounts" the App and adds a firebase auth listener */
	componentDidMount() {
		const setState = this.setState.bind(this);

		/**
		 * Setting the state to mounted prevents the component from trying to
		 * update the state when it is not mountned.
		 */
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

	/** Runs when the component props or state changes */
	componentDidUpdate(
		_prevProps: React.ComponentProps<"div">,
		prevState: AppState
	) {
		/**
		 * Mark the App as loaded once each individual piece has loaded.
		 */
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

		/** Reset the snapshots if the user logs in or out */
		if (
			(this.state.user && !prevState.user) ||
			(this.state.user &&
				prevState.user &&
				this.state.user.uid !== prevState.user.uid)
		) {
			this.resetSnapshots();
		}

		/** Reset the snapshot if there is no user anymore */
		if (!this.state.user && prevState.user) {
			this.resetSnapshots();
		}

		/**
		 * Once the user has logged in and their data has been loaded,
		 * then we can load their umbrella agency.
		 */
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

		/**
		 * Once the user has logged in and their data loaded, as well as their
		 * umbrella agency loaded, we can load the agencies for their umbrella.
		 */
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

		/**
		 * If there is a user logged in with data loaded, and they are not an admin,
		 * OR if there is an agency set but the agencies have changed via snapshot,
		 * we should load the agency specific to the user.
		 *
		 * Admins do not have agencies (thus do not load the agency for admins).
		 */
		if (
			(this.state.user &&
				this.state.userData &&
				!this.state.userData.admin &&
				this.state.umbrella &&
				this.state.agencies &&
				!this.state.agency) ||
			(this.state.agency &&
				this.state.agencies &&
				(!prevState.agencies ||
					!this.state.agencies.isEqual(prevState.agencies)))
		) {
			const userData = this.state.userData;

			if (userData?.admin === true || !userData) {
				this.setState({ agency: undefined });
			} else {
				this.setState({
					agency: this.state.agencies.docs.filter(
						x => x.id === userData.agency
					)[0],
				});
			}
		}

		/**
		 * If there is a user and their data, umbrella, and all the relevant
		 * agencies have loaded, we can load the relevant requests.
		 */
		if (
			this.state.user &&
			this.state.userData &&
			this.state.umbrella &&
			this.state.agencies &&
			!this.state.requests &&
			this.state.requestsLoading &&
			!this.state.settingRequestsSnapshot &&
			(this.state.userData.admin || this.state.agency)
		) {
			this.setState({ settingRequestsSnapshot: true });

			// Save the user's ID as the state may change while this is loading
			const userId = this.state.user.uid;

			// Run if the user is not an admin and their agency has loaded
			if (this.state.agency && this.state.userData.admin !== true) {
				// We change the firebase call depending on the user's agency type
				switch (this.state.agency.data()?.type) {
					case AgencyTypes.DONATOR:
						// Dontaors can only see the requests they made
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
						// Receivers can see their requests as well as unclaimed requests
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
						// Deliverers can see their requests as well as unclaimed requests
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
			} else if (this.state.userData.admin === true) {
				// Admins can see all requests in the same umbrella
				this.requestsSnapshot = firebase
					.firestore()
					.collection("requests")
					.where("umbrella", "==", this.state.umbrella.id)
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
			}
		}

		/**
		 * If the user, their data, their umbrella, and all agencies have loaded,
		 * we can load the relevant food log data.
		 */
		if (
			this.state.user &&
			this.state.userData &&
			this.state.umbrella &&
			this.state.agencies &&
			!this.state.logs &&
			this.state.logsLoading &&
			!this.state.settingLogsSnapshot
		) {
			this.setState({ settingLogsSnapshot: true });

			const userId = this.state.user.uid;

			this.logsSnapshot = firebase
				.firestore()
				.collection("logs")
				.orderBy("date")
				.onSnapshot(snapshot => {
					if (this.state.mounted && userId === this.state.user?.uid) {
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

	/** Before the component unmounts, reset auth and "unmount" the state */
	componentWillUnmount() {
		this.authListener();
		this.authListener = App.defaultListener;

		this.setState({ mounted: false });
	}

	/** Renders the App component */
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
			userData,
		} = this.state;

		/**
		 * Define the app views in render so that they will be updated if the state
		 * or props change.
		 */
		const appViews: AppViewsInterface = {
			[PageIds.CALENDAR]: (
				<AppContext.Consumer>
					{appContext => (
						<CalendarView
							agency={appContext.agency}
							requests={appContext.requests}
							userData={appContext.userData}
						/>
					)}
				</AppContext.Consumer>
			),
			[PageIds.DIRECTORY]: <DirectoryView />,
			[PageIds.ACCOUNT]: <AccountView />,
			[PageIds.FOODLOGS]: <FoodLogsView />,
		};

		// Create the app context to provide to all children
		const appContext: AppContextInterface = {
			agency,
			agencies,
			logs,
			requests,
			umbrella,
			user,
			userData,
		};

		return (
			<ThemeProvider theme={appTheme}>
				<AppContext.Provider value={appContext}>
					<Helmet>
						<html lang="en" />
						<title>
							{user
								? `${AppPages[currentPage].title} | Meal Matchup`
								: "Welcome to Meal Matchup"}
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
