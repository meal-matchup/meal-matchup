import "styled-components";

/**
 * Declares how the themes should be structured for use in
 * styled components.
 */
declare module "styled-components" {
	export interface DefaultTheme {
		breakpoints: {
			xs: string;
			sm: string;
			md: string;
			lg: string;
			xl: string;
			xxl: string;
		};
	}
}
