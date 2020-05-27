import { Button, Divider, Form, Input } from "antd";
import PropTypes, { InferProps } from "prop-types";
import { AppPage } from "../";
import { FormItemProps } from "antd/lib/form";
import React from "react";

interface SignUpViewState {
	signingUp: boolean;
	password?: string;
	genericStatus?: FormItemProps["validateStatus"];
	confirmStatus?: FormItemProps["validateStatus"];
}

class SignUpView extends React.Component<
	InferProps<typeof SignUpView.propTypes>,
	SignUpViewState
> {
	static propTypes = {
		changeView: PropTypes.func.isRequired,
	};

	constructor(props: InferProps<typeof SignUpView.propTypes>) {
		super(props);

		this.state = {
			signingUp: false,
		};

		this.logIn = this.logIn.bind(this);
	}

	logIn() {
		this.setState({
			signingUp: true,
			genericStatus: "validating",
		});
	}

	render() {
		const { changeView } = this.props;
		const { signingUp, genericStatus } = this.state;

		return (
			<AppPage id="SignUpView">
				<Form layout="vertical" onFinish={this.logIn}>
					<Form.Item
						name={["signup", "name"]}
						label="Name"
						rules={[
							{
								required: true,
								message: "Please enter your name",
							},
						]}
						hasFeedback
						validateStatus={genericStatus}
					>
						<Input disabled={signingUp} type="text" />
					</Form.Item>

					<Form.Item
						name={["signup", "email"]}
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
						<Input disabled={signingUp} type="email" />
					</Form.Item>

					<Form.Item
						name={["signup", "password"]}
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
						<Input
							disabled={signingUp}
							type="password"
							onChange={e => this.setState({ password: e.target.value })}
						/>
					</Form.Item>

					<Form.Item
						name={["signup", "confirm"]}
						label="Confirm password"
						rules={[
							{
								required: true,
								message: "Please confirm your password",
							},
							{
								validator: (_, value) =>
									value && this.state.password && this.state.password === value
										? Promise.resolve()
										: Promise.reject("Your passwords do not match"),
							},
						]}
						hasFeedback
						validateStatus={genericStatus}
					>
						<Input disabled={signingUp} type="password" />
					</Form.Item>
				</Form>

				<Divider />

				<p>
					Already have an account?
					<Button type="link" onClick={changeView}>
						Log in
					</Button>
				</p>
			</AppPage>
		);
	}
}

export default SignUpView;
