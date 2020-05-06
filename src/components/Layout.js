import React from 'react';
import PropTypes from 'prop-types';

function Layout({ children }) {
	return (
		<div className="site">
			Header
			<main>{children}</main>
			Footer
		</div>
	);
}

Layout.propTypes = {
	children: PropTypes.node,
};

export default Layout;
