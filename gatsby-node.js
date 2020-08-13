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
						slug
						status
					}
				}
			}
		}
	`).then((result) => {
		result.data.pages.edges.forEach((page) => {
			const { id, status } = page.node;
			if (status !== 'publish') return;
			const slug = page.node.slug === "home" ? "/" : `/${page.node.slug}`;

			createPage({
				path: slug,
				component: path.resolve('./src/templates/page.tsx'),
				context: {
					id,
					slug,
				},
			});
		});
	});
};
