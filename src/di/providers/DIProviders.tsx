import AlertProvider from "../../domain/providers/alert/AlertProvider";
import LanguageProvider from "../../domain/providers/language/LanguageProvider";
import ModalsProvider from "../../domain/providers/modal/ModalsProvider";
import UserProvider from "../../domain/providers/user/UserProvider";

interface DIProviders {
    alert: AlertProvider;
    languague: LanguageProvider;
    user: UserProvider;
    modals: ModalsProvider;
}

export default DIProviders;