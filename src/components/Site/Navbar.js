/// type stuff
import React from 'react';
import { useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components';
import '../../templates/page';

const navbarInner = styled('div')`
	max-width: ${props => props.theme.breakpoints.lg};
	width: 100%;
	text-align: center;
	margin-left: auto;
	margin-right: auto;
`;


const NavbarNav = styled('nav')`
	background-color: ${props => props.theme.colors.background};
	height: auto;
`;


const navbarLink = styled.a`
	color: ${props => props.theme.colors.accent};
	font-size: 16px;
	color: pink;
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

	// console.log("This data " + data.allWordpressPage.edges);
	// let thisss = data.allWordpressPage.edges[0];
	//console.log(thisss.node.title);
	let navbar = data.allWordpressPage.edges;

	let nav = navbar.map((item) => {
		return <navbarLink key={item.node.title}>{item.node.title}</navbarLink>;
	});

	return (
		<NavbarNav>
			<navbarInner>{nav}</navbarInner>
		</NavbarNav>
	);
}

export default Navbar;
