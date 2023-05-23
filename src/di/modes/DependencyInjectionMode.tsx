import DIProviders from "../providers/DIProviders";
import DIRepositories from "../repositories/DIRepositories";


export default interface DependencyInjectionMode {
    repositories: DIRepositories
    providers: DIProviders,
}