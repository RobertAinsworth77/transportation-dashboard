import React from "react";
import DependencyInjectionContextType from "./DependencyInjectionContextType";

const DependencyInjectionContext = React.createContext<DependencyInjectionContextType | undefined>(undefined);
export default DependencyInjectionContext;
