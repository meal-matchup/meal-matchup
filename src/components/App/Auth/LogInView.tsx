import { Button, Col, Divider, Form, Input, Row, message } from "antd";
import { AppPage } from "../";
import Debug from "debug";
import { FormItemProps } from "antd/lib/form";
import React from "react";
import { Store } from "antd/lib/form/interface";
import firebase from "gatsby-plugin-firebase";

const debug = Debug("http");

interface LogInViewProps {
	changeView: () => void;
}

interface LogInViewState {
	loggingIn: boolean;
	genericStatus?: FormItemProps["validateStatus"];
}

class LogInView extends React.Component<LogInViewProps, LogInViewState> {
	/** Initializes the log in view */
	constructor(props: LogInViewProps) {
		super(props);

		this.state = {
			loggingIn: false,
		};

		this.logIn = this.logIn.bind(this);
	}

	/**
	 * Logs in the user with their email and password
	 *
	 * @param values An ant.design values store
	 */
	logIn(values: Store) {
		this.setState({
			loggingIn: true,
			genericStatus: "validating",
		});

		const { email, password } = values;

		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.catch(error => {
				this.setState({
					loggingIn: false,
					genericStatus: "error",
				});

				switch (error.code) {
					case "auth/wrong-password":
						message.error("The password was incorrect");
						break;

					case "auth/user-not-found":
						message.error("This user does not exist");
						break;

					default:
						debug("Log in error", error);
						message.error("An error occurred");
						break;
				}
			});
	}

	/** Renders the log in view */
	render() {
		const { changeView } = this.props;
		const { loggingIn, genericStatus } = this.state;

		return (
			<AppPage id="LogInView">
				<Form layout="vertical" onFinish={this.logIn}>
					<Row gutter={16}>
						<Col span={24}>
							<Form.Item
								name={["email"]}
								label="Email address"
								rules={[
									{
										required: true,
										type: "email",
										message: "Please enter your email address",
									},
								]}
								hasFeedback
								validateStatus={genericStatus}
							>
								<Input disabled={loggingIn} type="email" />
							</Form.Item>

							<Form.Item
								name={["password"]}
								label="Password"
								rules={[
									{
										required: true,
										message: "Please enter a password",
									},
								]}
								hasFeedback
								validateStatus={genericStatus}
							>
								<Input disabled={loggingIn} type="password" />
							</Form.Item>

							<Form.Item>
								<Button
									disabled={loggingIn}
									type="primary"
									htmlType="submit"
									block
								>
									Log In
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>

				<Divider />

				<p>
					Don’t have an account?
					<Button type="link" onClick={changeView}>
						Sign up now!
					</Button>
				</p>
			</AppPage>
		);
	}
}

export default LogInView;
