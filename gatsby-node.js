const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
	const { createPage } = actions;

	await graphql(`
		{
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
			createPage({
				path: page.node.path,
				component: path.resolve('./src/templates/page.js'),
				context: {
					id,
					status,
				},
			});
		});
	});
};
