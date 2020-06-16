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
		font-size: 150%;
		font-style: italic;
		font-weight: 800;
		line-height: 1;
		margin: 1em 0 0.5em;
	}

	h1 {
		font-size: 5.6rem;
	}

	h2 {
		font-size: 4.4rem;
	}

	p {
		font-size: 1.8rem;
		line-height: 1.666;
		margin: 0 0 1em;
	}

	ul,
	ol {
		font-size: 1.8rem;
		line-height: 1.666;
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
