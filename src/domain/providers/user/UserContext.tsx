import React from "react";
import UserContextType from "./UserContextType";

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export default UserContext;