import { Footer, GlobalStyle, Header, SiteContext } from "./";
import React from "react";
import { ThemeProvider } from "styled-components";
import { siteTheme } from "../../utils/themes";

interface LayoutProps {
	children?: React.ReactNode;
}

class Layout extends React.Component<LayoutProps> {
	render() {
		const { children } = this.props;

		return (
			<SiteContext.Consumer>
				{siteContext => (
					<ThemeProvider theme={siteTheme}>
						<div className={`site ${siteContext.isHome ? "home" : "page"}`}>
							<GlobalStyle />

							<Header />

							<main className="site-main">{children}</main>

							<Footer />
						</div>
					</ThemeProvider>
				)}
			</SiteContext.Consumer>
		);
	}
}

export default Layout;
