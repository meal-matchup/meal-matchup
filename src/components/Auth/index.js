import React, { useState } from 'react';

import { AuthPages } from './Enums';

import { LogInView, SignUpView } from './Views';

function Auth() {
	// set current auth page
	const [activePage, setActivePage] = useState(AuthPages.LOGIN);

	const changeView = (view) => setActivePage(view);

	return (
		<div className="auth-screens">
			{activePage.id === AuthPages.LOGIN.id && (
				<LogInView changeView={changeView} />
			)}

			{activePage.id === AuthPages.SIGNUP.id && (
				<SignUpView changeView={changeView} />
			)}
		</div>
	);
}

export default Auth;
