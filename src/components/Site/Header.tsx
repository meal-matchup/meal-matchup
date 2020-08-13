import { Link, StaticQuery, graphql } from "gatsby";
import Nav from "./Nav";
import React from "react";
import { SiteContext } from "./";
import styled from "styled-components";

interface SiteTitleProps {
	logo?: string;
}

const SiteTitle = styled("span")<SiteTitleProps>`
	background-image: url(${props => props.logo});
	background-repeat: no-repeat;
	background-size: contain;
	display: block;
	height: 4.8rem;
	line-height: 1;
	margin: 0;
	width: 11.4rem;
`;

class Header extends React.Component {
	render() {
		const logoQuery = graphql`
			query HeaderLogoQuery {
				fork: file(relativePath: { eq: "fork.png" }) {
					publicURL
				}
			}
		`;

		return (
			<SiteContext.Consumer>
				{siteContext => (
					<header className="site-header">
						<div className="site-header-inner">
							<Link to="/" className="special site-logo">
								<StaticQuery
									query={logoQuery}
									render={data => (
										<SiteTitle
											logo={data.fork?.publicURL}
											as={siteContext.isHome ? "h1" : "span"}
										>
											<span className="sr-only">Meal Matchup</span>
										</SiteTitle>
									)}
								/>
							</Link>

							<Nav />

							<div className="app-link-container">
								<Link className="btn special" to="/app">
									Log In →
								</Link>
							</div>
						</div>
					</header>
				)}
			</SiteContext.Consumer>
		);
	}
}

export default Header;
