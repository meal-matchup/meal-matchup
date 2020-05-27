import React from 'react';
import PropTypes from 'prop-types';
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
	);
}

Layout.propTypes = {
	children: PropTypes.node,
};

export default Layout;
