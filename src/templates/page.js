import React from 'react';
import PropTypes from 'prop-types';

function PageTemplate({ data, pageContext }) {
	console.log(pageContext);
	return <p>Hi</p>;
}

PageTemplate.propTypes = {
	pageContext: PropTypes.shape({
		id: PropTypes.string.isRequired,
		status: PropTypes.string.isRequired,
	}).isRequired,
};

export default PageTemplate;
