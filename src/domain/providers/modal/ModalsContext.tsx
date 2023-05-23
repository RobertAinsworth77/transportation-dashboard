import React from "react";
import ModalsContextType from "./ModalsContextType";

const ModalsContext = React.createContext<ModalsContextType | undefined>(undefined);

export default ModalsContext;