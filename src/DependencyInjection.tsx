import GetActiveAlertsUseCase from "./domain/use_cases/alert/GetActiveAlertsUseCase";
import GetCurrentUserUseCase from "./domain/use_cases/auth/GetCurrentUserUseCase";
import LoginUseCase from "./domain/use_cases/auth/LoginUseCase";
import LogoutUseCase from "./domain/use_cases/auth/LogoutUseCase";
import SendCodeRecoveryUseCase from "./domain/use_cases/auth/SendCodeRecoveryUseCase";
import UpdatePasswordRecoveryUseCase from "./domain/use_cases/auth/UpdatePasswordRecoveryUseCase";
import CreateBusUseCase from "./domain/use_cases/bus/CreateBusUseCase";
import DeleteBusUseCase from "./domain/use_cases/bus/DeleteBusUseCase";
import GetBusByIdUseCase from "./domain/use_cases/bus/GetBusByIdUseCase";
import GetFiltredBussesUseCase from "./domain/use_cases/bus/GetFiltredBussesUseCase";
import SearchBusesByNameUseCase from "./domain/use_cases/bus/SearchBusesByNameUseCase";
import UpdateBusUseCase from "./domain/use_cases/bus/UpdateBusUseCase";
import GetAllCountersRelatedToTripUseCase from "./domain/use_cases/default/GetAllCountersRelatedToTripUseCase";
import GetAllKindUsersCountUseCase from "./domain/use_cases/default/GetAllKindUsersCountUseCase";
import CreateDriverUseCase from "./domain/use_cases/driver/CreateDriverUseCase";
import DeleteDriverUseCase from "./domain/use_cases/driver/DeleteDriverUseCase";
import GetDriverByIdUseCase from "./domain/use_cases/driver/GetDriverByIdUseCase";
import GetFiltredDriversesUseCase from "./domain/use_cases/driver/GetFiltredDriverUseCase";
import SearchDriversByNameUseCase from "./domain/use_cases/driver/SearchDriversByNameUseCase";
import UpdateDriverUseCase from "./domain/use_cases/driver/UpdateDriverUseCase";
import CreateEmployeeUseCase from "./domain/use_cases/employee/CreateEmployeeUseCase";
import DeleteEmployeeUseCase from "./domain/use_cases/employee/DeleteEmployeeUseCase";
import GetEmployeeByIdUseCase from "./domain/use_cases/employee/GetEmployeeByIdUseCase";
import GetFiltredEmployeesUseCase from "./domain/use_cases/employee/GetFiltredEmployeesUseCase";
import UpdateEmployeeUseCase from "./domain/use_cases/employee/UpdateEmployeeUseCase";
import CreateRouteUseCase from "./domain/use_cases/route/CreateRouteUseCase";
import DeleteRouteUseCase from "./domain/use_cases/route/DeleteRouteUseCase";
import GetFiltredRoutesesUseCase from "./domain/use_cases/route/GetFiltredDriverUseCase";
import GetRouteByIdUseCase from "./domain/use_cases/route/GetRouteByIdUseCase";
import SearchRoutesByNameUseCase from "./domain/use_cases/route/SearchRoutesByNameUseCase";
import UpdateRouteUseCase from "./domain/use_cases/route/UpdateRouteUseCase";
import SearchSitesByNameUseCase from "./domain/use_cases/site/SearchSitesByNameUseCase";
import CreateTripUseCase from "./domain/use_cases/trip/CreateTripUseCase";
import DeleteTripUseCase from "./domain/use_cases/trip/DeleteTripUseCase";
import GetFiltredTripsUseCase from "./domain/use_cases/trip/GetFiltredTripsUseCase";
import GetTripByIdUseCase from "./domain/use_cases/trip/GetTripByIdUseCase";
import UpdateTripUseCase from "./domain/use_cases/trip/UpdateTripUseCase";
import CreateUserUseCase from "./domain/use_cases/user/CreateUserUseCase";
import DeleteUserUseCase from "./domain/use_cases/user/DeleteUserUseCase";
import GetFiltredUsersUseCase from "./domain/use_cases/user/GetFiltredUsersUseCase";
import GetUserByIdUseCase from "./domain/use_cases/user/GetUserByIdUseCase";
import UpdateUserUseCase from "./domain/use_cases/user/UpdateUserUseCase";

interface RepositoriesDI {
    getActiveAlertsUseCase: GetActiveAlertsUseCase,
    
    getCurrentUserUseCase: GetCurrentUserUseCase,
    loginUseCase: LoginUseCase,
    logoutUseCase: LogoutUseCase,
    sendCodeRecoveryUseCase: SendCodeRecoveryUseCase,
    updatePasswordRecoveryUseCase: UpdatePasswordRecoveryUseCase,

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
    getFiltredDriversesUseCase: GetFiltredDriversesUseCase,
    searchDriversByNameUseCase: SearchDriversByNameUseCase,
    updateDriverUseCase: UpdateDriverUseCase,

    createEmployeeUseCase: CreateEmployeeUseCase,
    deleteEmployeeUseCase: DeleteEmployeeUseCase,
    getEmployeeByIdUseCase: GetEmployeeByIdUseCase,
    getFiltredEmployeesUseCase: GetFiltredEmployeesUseCase,
    updateEmployeeUseCase: UpdateEmployeeUseCase,

    createRouteUseCase: CreateRouteUseCase,
    deleteRouteUseCase: DeleteRouteUseCase,
    getRouteByIdUseCase: GetRouteByIdUseCase,
    getFiltredRoutesesUseCase: GetFiltredRoutesesUseCase,
    searchRoutesByNameUseCase: SearchRoutesByNameUseCase,
    updateRouteUseCase: UpdateRouteUseCase,

    searchSitesByNameUseCase: SearchSitesByNameUseCase,

    createTripUseCase: CreateTripUseCase,
    deleteTripUseCase: DeleteTripUseCase,
    getTripByIdUseCase: GetTripByIdUseCase,
    getFiltredTripsUseCase: GetFiltredTripsUseCase,
    updateTripUseCase: UpdateTripUseCase,

    createUserUseCase: CreateUserUseCase,
    deleteUserUseCase: DeleteUserUseCase,
    getUserByIdUseCase: GetUserByIdUseCase,
    getFiltredUsersUseCase: GetFiltredUsersUseCase,
    updateUserUseCase: UpdateUserUseCase,

}

export default interface DependencyInjection {
    repositories: RepositoriesDI
}