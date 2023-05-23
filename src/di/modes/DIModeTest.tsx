import AuthRepositoryTest from "../../data/repositories/auth/AuthRepositoryTest";
import DependencyInjectionMode from "./DependencyInjectionMode";
import AlertsProviderImpl from "../../ui/providers/alert/AlertsProviderImpl";
import AlertRepositoryTest from "../../data/repositories/alert/AlertRepositoryTest";
import BusRepositoryTest from "../../data/repositories/bus/BusRepositoryTest";
import DefaultRepositoryTest from "../../data/repositories/default/DefaultRepositoryTest";
import DriverRepositoryTest from "../../data/repositories/driver/DriverRepositoryTest";
import EmployeeRepositoryTest from "../../data/repositories/employee/EmployeeRepositoryTest";
import UserRepositoryTest from "../../data/repositories/user/UserRepositoryTest";
import RouteRepositoryTest from "../../data/repositories/route/RouteRepositoryTest";
import TripRepositoryTest from "../../data/repositories/trip/TripRepositoryTest";
import SiteRepositoryTest from "../../data/repositories/site/SiteRepositoryTest";
import AlertContext from "../../domain/providers/alert/AlertContext";
import UserContext from "../../domain/providers/user/UserContext";
import LanguageContext from "../../domain/providers/language/LanguageContext";
import LanguageProviderImpl from "../../ui/providers/language/LanguageProviderImpl";
import UserProviderImpl from "../../ui/providers/user/UserProviderImpl";
import ModalsProviderImpl from "../../ui/providers/modals/ModalsProviderImpl";
import ModalsContext from "../../domain/providers/modal/ModalsContext";
import UpdateAppRepositoryImpl from "../../data/repositories/updateApp/UpdateAppRepositoryImpl";

const DIModeTest: DependencyInjectionMode = {
    repositories: {
        alertRepository: AlertRepositoryTest,
        authRepository: AuthRepositoryTest,
        busRepository: BusRepositoryTest,
        defaultRepository: DefaultRepositoryTest,
        driverRepository: DriverRepositoryTest,
        employeeRepository: EmployeeRepositoryTest,
        routeRepository: RouteRepositoryTest,
        tripRepository: TripRepositoryTest,
        siteRepository: SiteRepositoryTest,
        updateAppRepository: UpdateAppRepositoryImpl,
        userRepository: UserRepositoryTest

    },
    providers: {
        alert: {
            contextType: undefined,
            Provider: AlertsProviderImpl,
            context: AlertContext,
        },
        user: {
            contextType: undefined,
            Provider: UserProviderImpl,
            context: UserContext,
        },
        languague: {
            contextType: undefined,
            Provider: LanguageProviderImpl,
            context: LanguageContext
        },
        modals: {
            contextType: undefined,
            Provider: ModalsProviderImpl,
            context: ModalsContext
        },
    },
}

export default DIModeTest;