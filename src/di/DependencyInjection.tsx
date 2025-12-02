import AlertAttendanceUseCase from "../domain/use_cases/alert/AlertAttendanceUseCase";
import GetActiveAlertsUseCase from "../domain/use_cases/alert/GetActiveAlertsUseCase";
import ConfirmAccountUseCase from "../domain/use_cases/auth/ConfirmAccountUseCase";
import GetCurrentUserUseCase from "../domain/use_cases/auth/GetCurrentUserUseCase";
import LoginUseCase from "../domain/use_cases/auth/LoginUseCase";
import LogoutUseCase from "../domain/use_cases/auth/LogoutUseCase";
import SendCodeConfirmAccountUseCase from "../domain/use_cases/auth/SendCodeConfirmAccountUseCase";
import SendCodeRecoveryUseCase from "../domain/use_cases/auth/SendCodeRecoveryUseCase";
import UpdatePasswordRecoveryUseCase from "../domain/use_cases/auth/UpdatePasswordRecoveryUseCase";
import CreateBusUseCase from "../domain/use_cases/bus/CreateBusUseCase";
import DeleteBusUseCase from "../domain/use_cases/bus/DeleteBusUseCase";
import GetBusByIdUseCase from "../domain/use_cases/bus/GetBusByIdUseCase";
import GetFiltredBussesUseCase from "../domain/use_cases/bus/GetFiltredBussesUseCase";
import SearchBusesByNameUseCase from "../domain/use_cases/bus/SearchBusesByNameUseCase";
import UpdateBusUseCase from "../domain/use_cases/bus/UpdateBusUseCase";
import GetAllCountersRelatedToTripUseCase from "../domain/use_cases/default/GetAllCountersRelatedToTripUseCase";
import GetAllKindUsersCountUseCase from "../domain/use_cases/default/GetAllKindUsersCountUseCase";
import LoadUseCase from "../domain/use_cases/default/LoadUseCase";
import CreateDriverUseCase from "../domain/use_cases/driver/CreateDriverUseCase";
import DeleteDriverUseCase from "../domain/use_cases/driver/DeleteDriverUseCase";
import GetDriverByIdUseCase from "../domain/use_cases/driver/GetDriverByIdUseCase";
import GetFiltredDriversUseCase from "../domain/use_cases/driver/GetFiltredDriverUseCase";
import SearchDriversByNameUseCase from "../domain/use_cases/driver/SearchDriversByNameUseCase";
import UpdateDriverUseCase from "../domain/use_cases/driver/UpdateDriverUseCase";
import GetEmployeeByEmailUseCase from "../domain/use_cases/employee/GetEmployeeByEmailUseCase";
import GetEmployeesByHrmUseCase from "../domain/use_cases/employee/GetEmployeesByHrmUseCase";
import CreateRouteUseCase from "../domain/use_cases/route/CreateRouteUseCase";
import DeleteRouteUseCase from "../domain/use_cases/route/DeleteRouteUseCase";
import GetFiltredRoutesUseCase from "../domain/use_cases/route/GetFiltredRoutesUseCase";
import GetPolylinesOfRouteUseCase from "../domain/use_cases/route/GetPolylinesOfRouteUseCase";
import GetPolylinesOfTwoPointnsUseCase from "../domain/use_cases/route/GetPolylinesOfTwoPointnsUseCase";
import GetRouteByIdUseCase from "../domain/use_cases/route/GetRouteByIdUseCase";
import SearchRoutesByNameUseCase from "../domain/use_cases/route/SearchRoutesByNameUseCase";
import UpdateRouteUseCase from "../domain/use_cases/route/UpdateRouteUseCase";
import CreateSiteUseCase from "../domain/use_cases/site/CreateSiteUseCase";
import DeleteSiteUseCase from "../domain/use_cases/site/DeleteSiteUseCase";
import GetCountriesOfSitesUseCase from "../domain/use_cases/site/GetCountriesOfSitesUseCase";
import GetFiltredSitesUseCase from "../domain/use_cases/site/GetFiltredSitesUseCase";
import GetSiteByIdUseCase from "../domain/use_cases/site/GetSiteByIdUseCase";
import SearchSitesByNameUseCase from "../domain/use_cases/site/SearchSitesByNameUseCase";
import UpdateSiteUseCase from "../domain/use_cases/site/UpdateSiteUseCase";
import CreateTripUseCase from "../domain/use_cases/trip/CreateTripUseCase";
import DeleteTripUseCase from "../domain/use_cases/trip/DeleteTripUseCase";
import GetFiltredTripsUseCase from "../domain/use_cases/trip/GetFiltredTripsUseCase";
import GetTripByIdUseCase from "../domain/use_cases/trip/GetTripByIdUseCase";
import TransferEmployeeUseCase from "../domain/use_cases/trip/TransferEmployeeUseCase";
import UpdateTripUseCase from "../domain/use_cases/trip/UpdateTripUseCase";
import CheckIfUpdateUseCase from "../domain/use_cases/updateApp/CheckIfUpdateUseCase";
import DownloadLastVersionUseCase from "../domain/use_cases/updateApp/DownloadLastVersionUseCase";
import RemindMeLaterUpdateUseCase from "../domain/use_cases/updateApp/RemindMeLaterUpdateUseCase";
import CreateUserUseCase from "../domain/use_cases/user/CreateUserUseCase";
import DeleteUserUseCase from "../domain/use_cases/user/DeleteUserUseCase";
import GetFiltredUsersUseCase from "../domain/use_cases/user/GetFiltredUsersUseCase";
import GetUserByIdUseCase from "../domain/use_cases/user/GetUserByIdUseCase";
import UpdateUserUseCase from "../domain/use_cases/user/UpdateUserUseCase";
import DependencyInjectionMode from "./modes/DependencyInjectionMode";
import DIModeDev from "./modes/DIModeDev";
import DIProviders from "./providers/DIProviders";
import DIRepositories from "./repositories/DIRepositories";

interface DIUseCases {
    alertAttendanceUseCase: AlertAttendanceUseCase;
    getActiveAlertsUseCase: GetActiveAlertsUseCase,

    getCurrentUserUseCase: GetCurrentUserUseCase,
    loginUseCase: LoginUseCase,
    logoutUseCase: LogoutUseCase,
    sendCodeRecoveryUseCase: SendCodeRecoveryUseCase,
    sendCodeConfirmAccountUseCase: SendCodeConfirmAccountUseCase,
    updatePasswordRecoveryUseCase: UpdatePasswordRecoveryUseCase,
    confirmAccountUseCase: ConfirmAccountUseCase,

    createBusUseCase: CreateBusUseCase,
    deleteBusUseCase: DeleteBusUseCase,
    getBusByIdUseCase: GetBusByIdUseCase,
    getFiltredBussesUseCase: GetFiltredBussesUseCase,
    searchBusesByNameUseCase: SearchBusesByNameUseCase,
    updateBusUseCase: UpdateBusUseCase,

    getAllKindUsersCountUseCase: GetAllKindUsersCountUseCase,
    getAllCountersRelatedToTripUseCase: GetAllCountersRelatedToTripUseCase,

    createDriverUseCase: CreateDriverUseCase,
    deleteDriverUseCase: DeleteDriverUseCase,
    getDriverByIdUseCase: GetDriverByIdUseCase,
    getFiltredDriversUseCase: GetFiltredDriversUseCase,
    searchDriversByNameUseCase: SearchDriversByNameUseCase,
    updateDriverUseCase: UpdateDriverUseCase,

    getEmployeeByEmailUseCase: GetEmployeeByEmailUseCase,
    getEmployeesByHrmUseCase: GetEmployeesByHrmUseCase,

    createRouteUseCase: CreateRouteUseCase,
    deleteRouteUseCase: DeleteRouteUseCase,
    getRouteByIdUseCase: GetRouteByIdUseCase,
    getFiltredRoutesUseCase: GetFiltredRoutesUseCase,
    searchRoutesByNameUseCase: SearchRoutesByNameUseCase,
    updateRouteUseCase: UpdateRouteUseCase,
    getPolylinesOfRouteUseCase: GetPolylinesOfRouteUseCase,
    getPolylinesOfTwoPointnsUseCase: GetPolylinesOfTwoPointnsUseCase,

    createSiteUseCase: CreateSiteUseCase,
    searchSitesByNameUseCase: SearchSitesByNameUseCase,
    getCountriesOfSitesUseCase: GetCountriesOfSitesUseCase,
    updateSiteUseCase: UpdateSiteUseCase,
    deleteSiteUseCase: DeleteSiteUseCase,
    getSiteByIdUseCase: GetSiteByIdUseCase,
    getFiltredSitesUseCase: GetFiltredSitesUseCase,

    createTripUseCase: CreateTripUseCase,
    deleteTripUseCase: DeleteTripUseCase,
    getTripByIdUseCase: GetTripByIdUseCase,
    getFiltredTripsUseCase: GetFiltredTripsUseCase,
    transferEmployeeUseCase: TransferEmployeeUseCase,
    updateTripUseCase: UpdateTripUseCase,

    checkIfUpdateUseCase: CheckIfUpdateUseCase,
    downloadLastVersionUseCase: DownloadLastVersionUseCase,
    remindMeLaterUpdateUseCase: RemindMeLaterUpdateUseCase,

    createUserUseCase: CreateUserUseCase,
    deleteUserUseCase: DeleteUserUseCase,
    getUserByIdUseCase: GetUserByIdUseCase,
    getFiltredUsersUseCase: GetFiltredUsersUseCase,
    updateUserUseCase: UpdateUserUseCase,

    loadUseCase: LoadUseCase,
}

const { repositories, providers }: DependencyInjectionMode = DIModeDev;



// #region usescases
const alertAttendanceUseCase = new AlertAttendanceUseCase({ alertRepository: repositories.alertRepository, alertProvider: providers.alert });
const getActiveAlertsUseCase = new GetActiveAlertsUseCase({ alertRepository: repositories.alertRepository, alertProvider: providers.alert, modalsProvider: providers.modals, languageProvider: providers.languague });

const getCurrentUserUseCase = new GetCurrentUserUseCase({ authRepository: repositories.authRepository, userProvider: providers.user });
const loginUseCase = new LoginUseCase({ authRepository: repositories.authRepository, userProvider: providers.user });
const logoutUseCase = new LogoutUseCase({ authRepository: repositories.authRepository, userProvider: providers.user });
const sendCodeRecoveryUseCase = new SendCodeRecoveryUseCase({ authRepository: repositories.authRepository });
const sendCodeConfirmAccountUseCase = new SendCodeConfirmAccountUseCase({ authRepository: repositories.authRepository });
const updatePasswordRecoveryUseCase = new UpdatePasswordRecoveryUseCase({ authRepository: repositories.authRepository });
const confirmAccountUseCase = new ConfirmAccountUseCase({ authRepository: repositories.authRepository });

const createBusUseCase = new CreateBusUseCase({ busRepository: repositories.busRepository });
const deleteBusUseCase = new DeleteBusUseCase({ busRepository: repositories.busRepository });
const getBusByIdUseCase = new GetBusByIdUseCase({ busRepository: repositories.busRepository });
const getFiltredBussesUseCase = new GetFiltredBussesUseCase({ busRepository: repositories.busRepository });
const searchBusesByNameUseCase = new SearchBusesByNameUseCase({ busRepository: repositories.busRepository });
const updateBusUseCase = new UpdateBusUseCase({ busRepository: repositories.busRepository });

const getAllKindUsersCountUseCase = new GetAllKindUsersCountUseCase({ defaultRepository: repositories.defaultRepository });
const getAllCountersRelatedToTripUseCase = new GetAllCountersRelatedToTripUseCase({ defaultRepository: repositories.defaultRepository });

const createDriverUseCase = new CreateDriverUseCase({ driverRepository: repositories.driverRepository, authRepository: repositories.authRepository });
const deleteDriverUseCase = new DeleteDriverUseCase({ driverRepository: repositories.driverRepository });
const getDriverByIdUseCase = new GetDriverByIdUseCase({ driverRepository: repositories.driverRepository });
const getFiltredDriversUseCase = new GetFiltredDriversUseCase({ driverRepository: repositories.driverRepository });
const searchDriversByNameUseCase = new SearchDriversByNameUseCase({ driverRepository: repositories.driverRepository });
const updateDriverUseCase = new UpdateDriverUseCase({ driverRepository: repositories.driverRepository });

const getEmployeeByEmailUseCase = new GetEmployeeByEmailUseCase({ employeeRepository: repositories.employeeRepository });
const getEmployeesByHrmUseCase = new GetEmployeesByHrmUseCase({ employeeRepository: repositories.employeeRepository });

const createRouteUseCase = new CreateRouteUseCase({ routeRepository: repositories.routeRepository });
const deleteRouteUseCase = new DeleteRouteUseCase({ routeRepository: repositories.routeRepository });
const getRouteByIdUseCase = new GetRouteByIdUseCase({ routeRepository: repositories.routeRepository });
const getFiltredRoutesUseCase = new GetFiltredRoutesUseCase({ routeRepository: repositories.routeRepository });
const searchRoutesByNameUseCase = new SearchRoutesByNameUseCase({ routeRepository: repositories.routeRepository });
const updateRouteUseCase = new UpdateRouteUseCase({ routeRepository: repositories.routeRepository });
const getPolylinesOfRouteUseCase = new GetPolylinesOfRouteUseCase({ routeRepository: repositories.routeRepository });
const getPolylinesOfTwoPointnsUseCase = new GetPolylinesOfTwoPointnsUseCase({ routeRepository: repositories.routeRepository });

const createSiteUseCase = new CreateSiteUseCase({ siteRepository: repositories.siteRepository });
const searchSitesByNameUseCase = new SearchSitesByNameUseCase({ siteRepository: repositories.siteRepository });
const getCountriesOfSitesUseCase = new GetCountriesOfSitesUseCase({ siteRepository: repositories.siteRepository });
const updateSiteUseCase = new UpdateSiteUseCase({ siteRepository: repositories.siteRepository });
const deleteSiteUseCase = new DeleteSiteUseCase({ siteRepository: repositories.siteRepository });
const getSiteByIdUseCase = new GetSiteByIdUseCase({ siteRepository: repositories.siteRepository });
const getFiltredSitesUseCase = new GetFiltredSitesUseCase({ siteRepository: repositories.siteRepository });

const createTripUseCase = new CreateTripUseCase({ tripRepository: repositories.tripRepository });
const deleteTripUseCase = new DeleteTripUseCase({ tripRepository: repositories.tripRepository });
const getTripByIdUseCase = new GetTripByIdUseCase({ tripRepository: repositories.tripRepository });
const getFiltredTripsUseCase = new GetFiltredTripsUseCase({ tripRepository: repositories.tripRepository });
const transferEmployeeUseCase = new TransferEmployeeUseCase({ tripRepository: repositories.tripRepository });
const updateTripUseCase = new UpdateTripUseCase({ tripRepository: repositories.tripRepository });

const checkIfUpdateUseCase = new CheckIfUpdateUseCase({ updateAppRepository: repositories.updateAppRepository });
const downloadLastVersionUseCase = new DownloadLastVersionUseCase({ updateAppRepository: repositories.updateAppRepository });
const remindMeLaterUpdateUseCase = new RemindMeLaterUpdateUseCase({ updateAppRepository: repositories.updateAppRepository });

const createUserUseCase = new CreateUserUseCase({ userRepository: repositories.userRepository, authRepository: repositories.authRepository });
const deleteUserUseCase = new DeleteUserUseCase({ userRepository: repositories.userRepository });
const getUserByIdUseCase = new GetUserByIdUseCase({ userRepository: repositories.userRepository });
const getFiltredUsersUseCase = new GetFiltredUsersUseCase({ userRepository: repositories.userRepository });
const updateUserUseCase = new UpdateUserUseCase({ userRepository: repositories.userRepository });

const loadUseCase = new LoadUseCase({
    getCurrentUserUseCase: getCurrentUserUseCase, getActiveAlertsUseCase: getActiveAlertsUseCase
});
// #endregion

const useCases: DIUseCases = {
    alertAttendanceUseCase: alertAttendanceUseCase,
    getActiveAlertsUseCase: getActiveAlertsUseCase,

    getCurrentUserUseCase: getCurrentUserUseCase,
    loginUseCase: loginUseCase,
    logoutUseCase: logoutUseCase,
    sendCodeRecoveryUseCase: sendCodeRecoveryUseCase,
    sendCodeConfirmAccountUseCase: sendCodeConfirmAccountUseCase,
    updatePasswordRecoveryUseCase: updatePasswordRecoveryUseCase,
    confirmAccountUseCase: confirmAccountUseCase,

    createBusUseCase: createBusUseCase,
    deleteBusUseCase: deleteBusUseCase,
    getBusByIdUseCase: getBusByIdUseCase,
    getFiltredBussesUseCase: getFiltredBussesUseCase,
    searchBusesByNameUseCase: searchBusesByNameUseCase,
    updateBusUseCase: updateBusUseCase,

    getAllKindUsersCountUseCase: getAllKindUsersCountUseCase,
    getAllCountersRelatedToTripUseCase: getAllCountersRelatedToTripUseCase,

    createDriverUseCase: createDriverUseCase,
    deleteDriverUseCase: deleteDriverUseCase,
    getDriverByIdUseCase: getDriverByIdUseCase,
    getFiltredDriversUseCase: getFiltredDriversUseCase,
    searchDriversByNameUseCase: searchDriversByNameUseCase,
    updateDriverUseCase: updateDriverUseCase,

    getEmployeeByEmailUseCase: getEmployeeByEmailUseCase,
    getEmployeesByHrmUseCase: getEmployeesByHrmUseCase,

    createRouteUseCase: createRouteUseCase,
    deleteRouteUseCase: deleteRouteUseCase,
    getRouteByIdUseCase: getRouteByIdUseCase,
    getFiltredRoutesUseCase: getFiltredRoutesUseCase,
    searchRoutesByNameUseCase: searchRoutesByNameUseCase,
    updateRouteUseCase: updateRouteUseCase,
    getPolylinesOfRouteUseCase: getPolylinesOfRouteUseCase,
    getPolylinesOfTwoPointnsUseCase: getPolylinesOfTwoPointnsUseCase,

    createSiteUseCase: createSiteUseCase,
    searchSitesByNameUseCase: searchSitesByNameUseCase,
    getCountriesOfSitesUseCase: getCountriesOfSitesUseCase,
    updateSiteUseCase: updateSiteUseCase,
    deleteSiteUseCase: deleteSiteUseCase,
    getSiteByIdUseCase: getSiteByIdUseCase,
    getFiltredSitesUseCase: getFiltredSitesUseCase,

    createTripUseCase: createTripUseCase,
    deleteTripUseCase: deleteTripUseCase,
    getTripByIdUseCase: getTripByIdUseCase,
    getFiltredTripsUseCase: getFiltredTripsUseCase,
    transferEmployeeUseCase: transferEmployeeUseCase,
    updateTripUseCase: updateTripUseCase,

    checkIfUpdateUseCase: checkIfUpdateUseCase,
    downloadLastVersionUseCase: downloadLastVersionUseCase,
    remindMeLaterUpdateUseCase: remindMeLaterUpdateUseCase,

    createUserUseCase: createUserUseCase,
    deleteUserUseCase: deleteUserUseCase,
    getUserByIdUseCase: getUserByIdUseCase,
    getFiltredUsersUseCase: getFiltredUsersUseCase,
    updateUserUseCase: updateUserUseCase,

    loadUseCase: loadUseCase
}

export interface DepenedencyInjector {
    repositories: DIRepositories
    providers: DIProviders,
    useCases: DIUseCases,
}
const DepenedencyInjectorImpl: DepenedencyInjector = {
    repositories: repositories,
    providers: providers,
    useCases: useCases
}

export default DepenedencyInjectorImpl;