import React from "react";
import { SiteContextInterface } from "../../utils/enums";

/** Creates an AppContext (both provider and consumer) */
const SiteContext = React.createContext<SiteContextInterface>({
	isHome: false,
});

export default SiteContext;
