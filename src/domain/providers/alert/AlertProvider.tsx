import Provider from "../Provider";
import ProviderProps from "../ProviderProps";
import AlertContextType from "./AlertContextType";

export default interface AlertProvider extends Provider{
    contextType: AlertContextType | undefined;
    context: React.Context<AlertContextType | undefined>;
    Provider: React.FC<ProviderProps>,
}