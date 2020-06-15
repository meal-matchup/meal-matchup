import { AppContextInterface } from "../../utils/enums";
import React from "react";

/** Creates an AppContext (both provider and consumer) */
const AppContext = React.createContext<AppContextInterface>({});

export default AppContext;
