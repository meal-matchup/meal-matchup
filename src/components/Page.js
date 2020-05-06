import React from 'react';
import PropTypes from 'prop-types';

function Page({ title, isHome, children }) {
	return (
		<div className="page">
			{!isHome && title && (
				<div className="page-header">
					<h1>{title}</h1>
				</div>
			)}

			{children}
		</div>
	);
}

Page.propTypes = {
	title: PropTypes.string,
	isHome: PropTypes.bool,
	childre: PropTypes.node,
};

export default Page;
