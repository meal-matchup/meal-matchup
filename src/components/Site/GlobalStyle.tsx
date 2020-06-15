import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
	html {
		font-size: 62.5%;
	}

	body {
		background-color: ${props => props.theme.colors.background};
		color: ${props => props.theme.colors.copy};
		font-family: ${props => props.theme.fonts.copy};
		font-size: 1.6rem;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		font-family: ${props => props.theme.fonts.heading};
		line-height: 1;
		margin: 1em 0 0.5em;
	}

	p {
		line-height: 1.6;
		margin: 0 0 1em;
	}

	.sr-only {
		border: 0;
		clip-path: inset(50%);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
		word-wrap: normal;
	}
`;

export default GlobalStyle;
