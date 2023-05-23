import ProviderProps from "./ProviderProps";

export default interface Provider {
    context: React.Context<any | undefined>;
    Provider: React.FC<ProviderProps>
}