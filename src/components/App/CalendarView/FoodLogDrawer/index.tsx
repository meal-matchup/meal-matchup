import { Button } from "antd";
import { Drawer } from "../../";
import FoodLogForm from "./FoodLogForm";
import React from "react";
import firebase from "gatsby-plugin-firebase";

interface FoodLogDrawerProps {
	occurrence?: firebase.firestore.QueryDocumentSnapshot;
	open?: boolean;
	onClose?: () => void;
	request?: firebase.firestore.QueryDocumentSnapshot;
}

interface FoodLogDrawerState {
	gotFoodLog: boolean;
	log?: firebase.firestore.DocumentSnapshot;
	mounted: boolean;
}

class FoodLogDrawer extends React.Component<
	FoodLogDrawerProps,
	FoodLogDrawerState
> {
	constructor(props: FoodLogDrawerProps) {
		super(props);

		this.onClose = this.onClose.bind(this);

		this.state = {
			gotFoodLog: false,
			mounted: false,
		};
	}

	onClose() {
		if (this.props.onClose) this.props.onClose();
	}

	componentDidMount() {
		this.setState({ mounted: true });
	}

	componentWillUnmount() {
		this.setState({ mounted: false });
	}

	componentDidUpdate(
		prevProps: FoodLogDrawerProps,
		prevState: FoodLogDrawerState
	) {
		if (
			this.props.occurrence &&
			this.props.occurrence?.data().logId &&
			(!this.state.gotFoodLog ||
				(prevState.gotFoodLog &&
					this.props.occurrence?.id !== prevProps.occurrence?.id))
		) {
			const occurrenceId = this.props.occurrence.id;
			const logId = this.props.occurrence.data()?.logId;

			firebase
				.firestore()
				.collection("logs")
				.doc(logId)
				.get()
				.then(logDoc => {
					if (
						this.state.mounted &&
						occurrenceId === this.props.occurrence?.id
					) {
						this.setState({ log: logDoc, gotFoodLog: true });
					}
				});
		} else if (!this.props.occurrence?.data()?.logId && this.state.log) {
			this.setState({ log: undefined });
		}
	}

	render() {
		const { occurrence, open, request } = this.props;
		const { log } = this.state;

		if (!occurrence || !request) return null;

		const formId = "food-log-form";

		const buttonStyles = {
			marginLeft: 8,
		};

		return (
			<Drawer
				visible={!!open}
				onClose={this.onClose}
				title="Entering Food Log"
				footer={
					<div style={{ textAlign: "right" }}>
						<Button onClick={this.onClose} style={buttonStyles}>
							Cancel
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							form={formId}
							style={buttonStyles}
						>
							Submit
						</Button>
					</div>
				}
			>
				<FoodLogForm
					formId={formId}
					givenItems={open ? log?.data()?.items : []}
					log={open ? log : undefined}
					occurrence={open ? occurrence : undefined}
					onFinish={this.onClose}
					request={open ? request : undefined}
				/>
			</Drawer>
		);
	}
}

export default FoodLogDrawer;
