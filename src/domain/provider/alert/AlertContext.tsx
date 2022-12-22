import React from "react";
import AlertContextType from "./AlertContextType";

const AlertContext = React.createContext<AlertContextType | undefined>(undefined);

export default AlertContext;