import { AppContextInterface } from "../../utils/enums";
import React from "react";

const AppContext = React.createContext<AppContextInterface>({});

export default AppContext;
