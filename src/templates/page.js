import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import Page from '../components/Page';

function PageTemplate({ data }) {
	const { title } = data.page;

	return (
		<Layout>
			<Page title={title} isHome={false}>
				this is a page!
			</Page>
		</Layout>
	);
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
