import React from "react";
import LanguageContextType from "./LanguageContextType";

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export default LanguageContext;