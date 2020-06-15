import { Link, StaticQuery, graphql } from "gatsby";
import React from "react";
import { SiteContext } from "./";
import styled from "styled-components";

const AppLink = styled(Link)`
	border: 2px solid ${props => props.theme.colors.accent};
	border-radius: 1em;
	color: ${props => props.theme.colors.accent};
	font-size: 1em;
	font-weight: 500;
	padding: 0.25em 0.5em;
	transition: background-color 0.3s, color 0.3s;

	&:hover {
		background-color: ${props => props.theme.colors.accent};
		color: ${props => props.theme.colors.background};
	}
`;

interface SiteTitleProps {
	logo?: string;
}

const SiteTitle = styled("span")<SiteTitleProps>`
	background-image: url(${props => props.logo});
	background-repeat: no-repeat;
	background-size: contain;
	box-sizing: content-box;
	display: block;
	font-family: ${props => props.theme.fonts.heading};
	font-size: 1em;
	height: 4.8rem;
	margin: 1em 0;
	width: 35.8rem;
`;

const HeaderContent = styled("div")`
	align-items: center;
	display: flex;
	justify-content: space-between;
	margin: 0 auto;
	max-width: ${props => props.theme.breakpoints.lg};
	width: calc(100% - 2em);
`;

const HeaderWrapper = styled("header")`
	background-color: ${props => props.theme.colors.background};
	position: relative;
	width: 100%;
`;

class Header extends React.Component {
	render() {
		const logoQuery = graphql`
			query HeaderLogoQuery {
				logo: file(relativePath: { eq: "logo.png" }) {
					publicURL
				}
			}
		`;

		return (
			<SiteContext.Consumer>
				{siteContext => (
					<HeaderWrapper>
						<HeaderContent>
							<Link to="/">
								<StaticQuery
									query={`${logoQuery}`}
									render={data => (
										<SiteTitle
											logo={data.logo?.publicURL}
											as={siteContext.isHome ? "h1" : "span"}
										>
											<span className="sr-only">Meal Matchup</span>
										</SiteTitle>
									)}
								/>
							</Link>

							<AppLink to="/app">Log In/Sign Up</AppLink>
						</HeaderContent>
					</HeaderWrapper>
				)}
			</SiteContext.Consumer>
		);
	}
}

export default Header;
