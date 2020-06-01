import { Button, Col, Divider, Form, Input, Row, message } from "antd";
import PropTypes, { InferProps } from "prop-types";
import { AppPage } from "../";
import { FormItemProps } from "antd/lib/form";
import React from "react";
import { Store } from "antd/lib/form/interface";
import debug from "../../../utils/debug";
import firebase from "gatsby-plugin-firebase";

interface LogInViewState {
	loggingIn: boolean;
	genericStatus?: FormItemProps["validateStatus"];
}

class LogInView extends React.Component<
	InferProps<typeof LogInView.propTypes>,
	LogInViewState
> {
	static propTypes = {
		changeView: PropTypes.func.isRequired,
	};

	constructor(props: InferProps<typeof LogInView.propTypes>) {
		super(props);

		this.state = {
			loggingIn: false,
		};

		this.logIn = this.logIn.bind(this);
	}

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

					default:
						message.error("An error occurred");
						break;
				}
			});
	}

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
