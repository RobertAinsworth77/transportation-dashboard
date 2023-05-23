import Provider from "../Provider";
import ProviderProps from "../ProviderProps";
import UserContextType from "./UserContextType";

export default interface UserProvider extends Provider{
    contextType: UserContextType | undefined;
    context: React.Context<UserContextType | undefined>;
    Provider: React.FC<ProviderProps>
}