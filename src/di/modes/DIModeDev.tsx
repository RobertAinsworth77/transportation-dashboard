import AuthRepositoryTest from "../../data/repositories/auth/AuthRepositoryTest";
import DependencyInjectionMode from "./DependencyInjectionMode";
import AlertsProviderImpl from "../../ui/providers/alert/AlertsProviderImpl";
import AlertRepositoryTest from "../../data/repositories/alert/AlertRepositoryTest";
import BusRepositoryTest from "../../data/repositories/bus/BusRepositoryTest";
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
import DefaultRepositoryImpl from "../../data/repositories/default/DefaultRepositoryImpl";
import DriverRepositoryImpl from "../../data/repositories/driver/DriverRepositoryImpl";
import UserRepositoryImpl from "../../data/repositories/user/UserRepositoryImpl";
import AuthRepositoryImpl from "../../data/repositories/auth/AuthRepositoryImpl";
import SiteRepositoryImpl from "../../data/repositories/site/SiteRepositoryImpl";
import RouteRepositoryImpl from "../../data/repositories/route/RouteRepositoryImpl";
import TripRepositoryImpl from "../../data/repositories/trip/TripRepositoryImpl";
import BusRepositoryImpl from "../../data/repositories/bus/BusRepositoryImpl";
import AlertRepositoryImpl from "../../data/repositories/alert/AlertRepositoryImpl";
import UpdateAppRepositoryImpl from "../../data/repositories/updateApp/UpdateAppRepositoryImpl";

const DIModeDev: DependencyInjectionMode = {
    repositories: {
        alertRepository: AlertRepositoryImpl,
        authRepository: AuthRepositoryImpl,
        busRepository: BusRepositoryImpl,
        defaultRepository: DefaultRepositoryImpl,
        driverRepository: DriverRepositoryImpl,
        employeeRepository: EmployeeRepositoryTest,
        routeRepository: RouteRepositoryImpl,
        tripRepository: TripRepositoryImpl,
        siteRepository: SiteRepositoryImpl,
        updateAppRepository: UpdateAppRepositoryImpl,
        userRepository: UserRepositoryImpl

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

export default DIModeDev;