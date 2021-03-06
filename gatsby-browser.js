// Require firebase on all pages
require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

// Require fonts
require("fontsource-nunito-sans");
require("fontsource-playfair-display");

// Require ant design on all pages
require("antd/dist/antd.less");

// Require site styles
require("./src/styles/site.less");

// Set up wrapping
export const wrapPageElement = require("./src/utils/wrapPageElement").default;

const transitionDelay = 500;

export const shouldUpdateScroll = ({
	routerProps: { location },
	getSavedScrollPosition,
}) => {
	if (location.action === "PUSH") {
		window.setTimeout(() => window.scrollTo(0, 0), transitionDelay);
	} else {
		const savedPosition = getSavedScrollPosition(location);
		window.setTimeout(
			() => window.scrollTo(...(savedPosition || [0, 0])),
			transitionDelay
		);
	}
	return false;
};
