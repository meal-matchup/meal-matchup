import React, { useState } from 'react';
import firebase from 'gatsby-plugin-firebase';
import { AnimatePresence } from 'framer-motion';
import debug from 'debug';

import { Button, Divider, Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import AuthScreen from './AuthScreen';

function Auth() {
	const [activePage, setActivePage] = useState('welcome');

	const [logInForm] = Form.useForm();
	const [loggingIn, setLoggingIn] = useState(false);
	const [logInStatus, setLogInStatus] = useState(null);

	const [signUpForm] = Form.useForm();
	const [signingUp, setSigningUp] = useState(false);
	const [signUpEmailStatus, setSignUpEmailStatus] = useState(null);
	const [signUpPassword, setSignUpPassword] = useState('');
	const [signUpPasswordStatus, setSignUpPasswordStatus] = useState(null);
	const [signUpConfimStatus, setSignUpConfirmStatus] = useState(null);

	const goToPage = page => setActivePage(page);

	const logIn = values => {
		if (!firebase) return false;
		setLoggingIn(true);
		setLogInStatus('validating')
		const { email, password } = values.login;

		return firebase.auth().signInWithEmailAndPassword(email, password)
			.catch(e => {
				debug('Log in error', e);
				setLoggingIn(false);
				setLogInStatus('error');
			});
	};

	const signUp = values => {
		if (!firebase) return false;

		setSigningUp(true);
		setSignUpEmailStatus('validating');
		setSignUpPasswordStatus('validating');
		setSignUpConfirmStatus('validating');

		const { email, password, confirm } = values.signup;
		if (confirm !== password) {
			setSigningUp(false);
			setSignUpEmailStatus(null);
			setSignUpPasswordStatus(null);
			setSignUpConfirmStatus('error');
			return false;
		}

		return firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((result) => {
				return firebase.firestore().collection('users').doc(result.user.uid).set({
					email: result.user.email,
				});
			})
			.catch(e => {
				debug(e);
				setSigningUp(false);
				setSignUpEmailStatus('error');
				setSignUpPasswordStatus('error');
				setSignUpConfirmStatus('error');
				return false;
			});
	}

	return (
		<div className="auth-screens">
			<AnimatePresence>
				{activePage === 'welcome' && (
					<AuthScreen id="welcome">
						<p>Welcome</p>
						<Button type="link" onClick={() => goToPage('log-in')}>Log In</Button>
					</AuthScreen>
				)}

				{activePage === 'log-in' && (
					<AuthScreen id="log-in">
						<h1>Log In</h1>

						<Form layout="vertical" form={logInForm} onFinish={logIn}>
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
								<Input disabled={loggingIn} prefix={<UserOutlined />} type="email" />
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
								<Input disabled={loggingIn} prefix={<LockOutlined />} type="password" />
							</Form.Item>

							<Form.Item>
								<Button disabled={loggingIn} type="primary" htmlType="submit" block>Log In</Button>
							</Form.Item>
						</Form>

						<Divider />

						<p>
							Don't have an account?
							<Button type="link" onClick={() => goToPage('sign-up')}>Sign up now!</Button>
						</p>
					</AuthScreen>
				)}

				{activePage === 'sign-up' && (
					<AuthScreen id="sign-up">
						<h1>Sign Up</h1>

						<Form layout="vertical" form={signUpForm} onFinish={signUp}>
							<Form.Item
								name={['signup', 'email']}
								label="Email address"
								rules={[
									{
										required: true,
										type: 'email',
										message: 'Please enter your email address',
									},
								]}
								hasFeedback
								validateStatus={signUpEmailStatus}
							>
								<Input disabled={signingUp} type="email" />
							</Form.Item>

							<Form.Item
								name={['signup', 'password']}
								label="Password"
								rules={[
									{
										required: true,
										message: 'Please enter a password',
									},
								]}
								hasFeedback
								validateStatus={signUpPasswordStatus}
							>
								<Input disabled={signingUp} onChange={e => setSignUpPassword(e.target.value)} type="password" />
							</Form.Item>

							<Form.Item
								name={['signup', 'confirm']}
								label="Confirm password"
								rules={[
									{
										required: true,
										message: 'Please confirm your password',
									},
									{
										validator: (_, value) => value ? signUpPassword === value ? Promise.resolve() : Promise.reject('Your passwords do not match') : Promise.resolve(),
									},
								]}
								hasFeedback
								validateStatus={signUpConfimStatus}
							>
								<Input disabled={signingUp} type="password" />
							</Form.Item>

							<Form.Item
								name={['signup', 'tos']}
								valuePropName="checked"
								rules={[
									{
										validator:(_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement'),
									},
								]}
							>
								<Checkbox disabled={signingUp}>I agree to the terms of service</Checkbox>
							</Form.Item>

							<Form.Item>
								<Button disabled={signingUp} type="primary" htmlType="submit" block>Sign Up</Button>
							</Form.Item>
						</Form>

						<Divider />

						<p>
							Already have an account?
							<Button type="link" onClick={() => goToPage('log-in')}>Log in</Button>
						</p>
					</AuthScreen>
				)}
			</AnimatePresence>
		</div>
	);
}

export default Auth;
