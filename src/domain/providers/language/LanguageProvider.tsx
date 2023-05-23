import Provider from "../Provider";
import ProviderProps from "../ProviderProps";
import LanguageContextType from "./LanguageContextType";

export default interface LanguageProvider extends Provider {
    contextType: LanguageContextType | undefined;
    context: React.Context<LanguageContextType | undefined>;
    Provider: React.FC<ProviderProps>
}