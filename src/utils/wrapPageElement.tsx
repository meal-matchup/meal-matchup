import { Layout, SiteContext } from "../components/Site";
import React from "react";

interface PageWrapperProps {
	element: React.ReactNode;
	props: {
		path?: string;
	};
}

function wrapPageElement({ element, props }: PageWrapperProps) {
	if (props.path?.indexOf("/app") === 0) return element;
	return (
		<SiteContext.Provider value={{ isHome: props.path === "/" }}>
			<Layout>{element}</Layout>
		</SiteContext.Provider>
	);
}

export default wrapPageElement;
