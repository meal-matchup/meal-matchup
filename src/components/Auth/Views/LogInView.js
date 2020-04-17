import React, { useState } from 'react';
import PropTypes from 'prop-types';
import firebase from 'gatsby-plugin-firebase';
import debug from 'debug';
import { Button, Divider, Form, Input, Layout, PageHeader } from 'antd';

import { AuthPages } from '../Enums';

function LogInView({ changeView }) {
	const [logInForm] = Form.useForm();
	const [loggingIn, setLoggingIn] = useState(false);
	const [logInStatus, setLogInStatus] = useState(null);

	const logIn = (values) => {
		setLoggingIn(true);
		setLogInStatus('validating');
		const { email, password } = values.login;
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.catch((error) => {
				setLoggingIn(false);
				setLogInStatus('error');
				debug('Could not sign in', error);
			});
	};

	return (
		<Layout style={{ backgroundColor: 'transparent' }}>
			<PageHeader
				title={AuthPages.LOGIN.title}
				style={{ marginBottom: '1em', padding: 0 }}
			/>

			<Layout.Content>
				<Form
					form={logInForm}
					layout="vertical"
					hideRequiredMark
					onFinish={logIn}
				>
					<Form.Item
						name={['login', 'email']}
						label="Email address"
						rules={[
							{
								required: true,
								type: 'email',
								message: 'Please enter your email address',
							},
						]}
						hasFeedback
						validateStatus={logInStatus}
					>
						<Input disabled={loggingIn} type="email" />
					</Form.Item>

					<Form.Item
						name={['login', 'password']}
						label="Password"
						rules={[
							{
								required: true,
								message: 'Please enter your password',
							},
						]}
						hasFeedback
						validateStatus={logInStatus}
					>
						<Input disabled={loggingIn} type="password" />
					</Form.Item>

					<Form.Item>
						<Button disabled={loggingIn} type="primary" htmlType="submit" block>
							Log In
						</Button>
					</Form.Item>
				</Form>

				<Divider />

				<p>
					Don’t have an account?
					<Button type="link" onClick={() => changeView(AuthPages.SIGNUP)}>
						Sign up now!
					</Button>
				</p>
			</Layout.Content>
		</Layout>
	);
}

LogInView.propTypes = {
	changeView: PropTypes.func.isRequired,
};

export default LogInView;
