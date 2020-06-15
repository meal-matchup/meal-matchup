import { Footer, GlobalStyle, Header, Navbar } from "./";
import styled, { ThemeProvider } from "styled-components";
import React from "react";
import { siteTheme } from "../../utils/themes";

const MainWrapper = styled("main")``;

interface LayoutProps {
	children?: React.ReactNode;
}

class Layout extends React.Component<LayoutProps> {
	render() {
		const { children } = this.props;

		return (
			<ThemeProvider theme={siteTheme}>
				<GlobalStyle />

				<Header />

				<Navbar />

				<MainWrapper>{children}</MainWrapper>

				<Footer />
			</ThemeProvider>
		);
	}
}

export default Layout;
