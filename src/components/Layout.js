import React from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import Navbar from './Site/Navbar';

function Layout({ children }) {
	return (
		<div className="site">
			Header
			<Navbar />
			<main>{children}</main>
			Footer
		</div>
=======
import { ThemeProvider } from 'styled-components';
import { siteTheme } from '../utils/themes';

function Layout({ children }) {
	return (
		<ThemeProvider theme={siteTheme}>
			<div className="site">
				Header
				<main>{children}</main>
				Footer
			</div>
		</ThemeProvider>
>>>>>>> abcccc8d2b55c9df344fe90c40691cdfa8be8059
	);
}

Layout.propTypes = {
	children: PropTypes.node,
};

export default Layout;
