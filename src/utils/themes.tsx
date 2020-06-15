import { DefaultTheme } from "styled-components";

/** The Site's theme */
export const siteTheme: DefaultTheme = {
	breakpoints: {
		sm: "544px",
		md: "768px",
		lg: "1012px",
		xl: "1280px",
	},

	colors: {
		accent: "#01331a",
		background: "#f6f4ee",
		copy: "#333",
	},

	fonts: {
		heading: "Roboto Slab, serif",
		copy: "Roboto, sans-serif",
	},
};

/** The App's theme, using ant.design breakpoints */
export const appTheme: DefaultTheme = {
	...siteTheme,

	breakpoints: {
		xs: "480px",
		sm: "576px",
		md: "768px",
		lg: "992px",
		xl: "1200px",
		xxl: "1600px",
	},
};
