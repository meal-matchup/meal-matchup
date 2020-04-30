import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

function PageTemplate({ data }) {
	const { title } = data.page;

	return <h1>{title}</h1>;
}

PageTemplate.propTypes = {
	pageContext: PropTypes.shape({
		id: PropTypes.string.isRequired,
	}).isRequired,
	data: PropTypes.shape({
		page: PropTypes.shape({
			title: PropTypes.string.isRequired,
		}).isRequired,
	}).isRequired,
};

export default PageTemplate;

export const query = graphql`
	query PageTemplateQuery($id: String) {
		page: wordpressPage(id: { eq: $id }) {
			title
		}
	}
`;
