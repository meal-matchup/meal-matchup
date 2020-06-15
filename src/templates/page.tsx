import React from "react";
import { SiteContext } from "../components/Site";
import { graphql } from "gatsby";

interface PageTemplateProps {
	pageContext: {
		id: string;
		slug: string;
	};
	data: {
		page: {
			content: string;
			title: string;
		};
	};
}

class PageTemplate extends React.Component<PageTemplateProps> {
	render() {
		const { content, title } = this.props.data.page;

		return (
			<SiteContext.Consumer>
				{siteContext => (
					<>
						{!siteContext.isHome && <h1>{title}</h1>}

						<div dangerouslySetInnerHTML={{ __html: content }} />
					</>
				)}
			</SiteContext.Consumer>
		);
	}
}

export default PageTemplate;

export const query = graphql`
	query PageTemplateQuery($id: String) {
		page: wordpressPage(id: { eq: $id }) {
			content
			slug
			title
		}
	}
`;
