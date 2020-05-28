import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Site/Navbar';

function Layout({ children }) {
	return (
		<div className="site">
			Header
			<Navbar />
			<main>{children}</main>
			Footer
		</div>
	);
}

Layout.propTypes = {
	children: PropTypes.node,
};

export default Layout;
