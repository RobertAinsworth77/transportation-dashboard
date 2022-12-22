import ProviderProps from "../ProviderProps";
import UserContextType from "./UserContextType";

export default interface UserProvider{
    actions: UserContextType | undefined;
    Provider: React.FC<ProviderProps>
}