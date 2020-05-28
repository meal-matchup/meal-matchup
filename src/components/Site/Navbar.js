/// type stuff
import React from 'react';
import { useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components';

const navbarInner = styled('div')`
	max-width: ${props => props.theme.breakpoints.lg};
	width: 100%;
	margin-left: auto;
	margin-right: auto;
`;

const NavbarNav = styled('nav')`
	height: auto;
	background-color: ${props => props.theme.colors.background};
`;

const navbarLink = styled('h2')`
	font-size: 16px;
	padding: 1em 0.5em;
	color: ${props => props.theme.colors.accent};
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
	  }`, 'menu_order') // is this right??

	// console.log("This data " + data.allWordpressPage.edges);
	// let thisss = data.allWordpressPage.edges[0];
	//console.log(thisss.node.title);
	let navbar = data.allWordpressPage.edges;

	let nav = navbar.map((item) => {
		return(
			<navbarLink>{item.node.title}</navbarLink>
		)

	});

	return (
		<NavbarNav>
			<navbarInner>
				{nav}
			</navbarInner>
		</NavbarNav>
	);
}

export default Navbar;
