import { Link, StaticQuery, graphql } from "gatsby";
import React from "react";
import styled from "styled-components";

const NavbarLink = styled(Link)`
	align-items: center;
	border-bottom: 2px solid ${props => props.theme.colors.background};
	border-top: 2px solid ${props => props.theme.colors.background};
	color: ${props => props.theme.colors.accent};
	display: inline-block;
	font-size: 1em;
	font-weight: 500;
	padding: 0.75em 0.5em;
	transition: background-color 0.15s, border-bottom-color 0.3s, color 0.15s;

	&:hover {
		color: ${props => props.theme.colors.copy};
	}

	&[aria-current="page"] {
		border-bottom-color: ${props => props.theme.colors.copy};
		color: ${props => props.theme.colors.copy};
	}
`;

const NavbarNav = styled("nav")`
	display: block;
	max-width: ${props => props.theme.breakpoints.lg};
	margin: 0 auto;
	width: calc(100% - 2em);
`;

const NavbarWrapper = styled("div")`
	background-color: ${props => props.theme.colors.background};
	box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
	position: sticky;
	top: 0;
	width: 100%;
`;

interface NavbarProps {
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

class Navbar extends React.Component<NavbarProps> {
	render() {
		const { data } = this.props;

		return (
			<NavbarWrapper>
				<NavbarNav>
					{data.allWordpressPage.edges.map(edge => {
						const { slug, title } = edge.node;

						return (
							<NavbarLink key={slug} to={`/${slug}`}>
								{title}
							</NavbarLink>
						);
					})}
				</NavbarNav>
			</NavbarWrapper>
		);
	}
}

function getNavbar() {
	const query = graphql`
		query NavbarQuery {
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
		<StaticQuery query={`${query}`} render={data => <Navbar data={data} />} />
	);
}

export default getNavbar;
