import Provider from "../Provider";
import ProviderProps from "../ProviderProps";
import ModalsContextType from "./ModalsContextType";

export default interface ModalsProvider extends Provider {
    contextType: ModalsContextType | undefined;
    context: React.Context<ModalsContextType | undefined>;
    Provider: React.FC<ProviderProps>
}