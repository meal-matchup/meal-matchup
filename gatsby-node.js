const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions;

	await graphql(`
		{
			site {
				siteMetadata {
					title
					description
				}
			}

			metadata: wordpressSiteMetadata {
				name
				description
			}

			pages: allWordpressPage {
				edges {
					node {
						id
						path
						status
					}
				}
			}
		}
	`).then((result) => {
		result.data.pages.edges.forEach((page) => {
			const { id, status } = page.node;
			if (status !== 'publish') return;
			const slug = page.node.path.replace('/mealmatchup/wordpress/', '/');

			createPage({
				path: slug,
				component: path.resolve('./src/templates/page.js'),
				context: {
					id,
					slug,
				},
			});
		});
	});
};
