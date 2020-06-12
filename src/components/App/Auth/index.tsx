import { AnimatePresence } from "framer-motion";
import { AppPage } from "../";
import { InferProps } from "prop-types";
import LogInView from "./LogInView";
import React from "react";
import SignUpView from "./SignUpView";
import styled from "styled-components";

const AuthPage = styled("div")`
	height: 100%;
	left: 50%;
	margin: 0 auto;
	max-height: 100%;
	max-width: 540px;
	padding: 1em;
	position: absolute;
	top: 0;
	transform: translate3d(-50%, 0, 0);
	width: 100%;

	@media (min-width: ${props => props.theme.breakpoints.sm}) {
		top: 50%;
		transform: translate3d(-50%, -50%, 0);
		height: auto;
	}
`;

interface AuthState {
	signingUp: boolean;
}

class Auth extends React.Component<
	InferProps<typeof Auth.propTypes>,
	AuthState
> {
	static propTypes = {};

	constructor(props: InferProps<typeof Auth.propTypes>) {
		super(props);

		this.state = {
			signingUp: false,
		};

		this.changeView = this.changeView.bind(this);
	}

	changeView() {
		this.setState({ signingUp: !this.state.signingUp });
	}

	render() {
		const { signingUp } = this.state;

		return (
			<AppPage id="Auth">
				<AuthPage>
					<div
						style={{
							fontSize: "2em",
							padding: "1em",
							textAlign: "center",
						}}
					>
						Meal Matchup
					</div>

					<AnimatePresence exitBeforeEnter>
						{signingUp ? (
							<SignUpView changeView={this.changeView} />
						) : (
							<LogInView changeView={this.changeView} />
						)}
					</AnimatePresence>
				</AuthPage>
			</AppPage>
		);
	}
}

export default Auth;
