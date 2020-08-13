import { Link, StaticQuery, graphql } from "gatsby";
import React from "react";

interface Props {
	data: {
		allWordpressPage: {
			edges: {
				node: {
					slug: string;
					title: string;
				};
			}[];
		};
	};
}

class Nav extends React.Component<Props> {
	render() {
		const { data } = this.props;

		return (
			<nav className="site-header-nav">
				{data.allWordpressPage.edges.map(edge => {
					const { slug, title } = edge.node;

					return (
						<Link key={slug} to={`/${slug}`}>
							{title}
						</Link>
					);
				})}
			</nav>
		);
	}
}

function getNav() {
	const query = graphql`
		query NavQuery {
			allWordpressPage(
				sort: { fields: menu_order }
				filter: { menu_order: { gt: 0 } }
			) {
				edges {
					node {
						menu_order
						slug
						title
					}
				}
			}
		}
	`;

	return (
		<StaticQuery query={`${query}`} render={data => <Nav data={data} />} />
	);
}

export default getNav;
