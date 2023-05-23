import { DepenedencyInjector } from "../DependencyInjection";

type DependencyInjectionContextType = {
    di: DepenedencyInjector;
    setValue: (value: DepenedencyInjector) => void;
};

export default DependencyInjectionContextType;