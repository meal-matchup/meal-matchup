import React from "react";
import firebase from "gatsby-plugin-firebase";

interface PageContentProps {
	siderVisible: 1 | 0;
}

interface AppState {
	agencies?: firebase.firestore.QuerySnapshot;
	agenciesLoading: boolean;
	loading: boolean;
	mounted: boolean;
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
	}

	render() {
		return <p>app</p>;
	}
}

export default App;
