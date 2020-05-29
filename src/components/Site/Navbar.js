import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import '../../templates/page';

const NavbarInner = styled('div')`
	max-width: ${(props) => props.theme.breakpoints.lg};
	width: 100%;
	height: auto;
	margin-left: auto;
	margin-right: auto;
`;

const NavbarNav = styled('nav')`
	background-color: ${(props) => props.theme.colors.background};
	height: auto;
`;

const NavbarP = styled('p')`
	color: ${(props) => props.theme.colors.accent};
	font-size: 16px;
	padding: 1em 0.5em;
`;

function Navbar() {
	const data = useStaticQuery(graphql`
			query MyQuery {
				allWordpressPage {
					edges {
						node {
							slug
							title
						}
					}
				}
			}
		`,
		'menu_order'
	); // is this right??
	let navbar = data.allWordpressPage.edges;
	let nav = navbar.map((item) => {
		return <NavbarP key={item.node.title}>{item.node.title}</NavbarP>;
	});

	return (
		<NavbarNav>
			<NavbarInner>{nav}</NavbarInner>
		</NavbarNav>
	);
}

export default Navbar;
