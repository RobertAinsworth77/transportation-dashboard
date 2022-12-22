import ProviderProps from "../ProviderProps";
import AlertContextType from "./AlertContextType";

export default interface AlertProvider{
    actions: AlertContextType;
    Provider: React.FC<ProviderProps>
}