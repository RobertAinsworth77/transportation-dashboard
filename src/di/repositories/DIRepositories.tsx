import AlertRepository from "../../domain/repositories/AlertRepository";
import AuthRepository from "../../domain/repositories/AuthRepository";
import BusRepository from "../../domain/repositories/BusRepository";
import DefaultRepository from "../../domain/repositories/DefaultRepository";
import DriverRepository from "../../domain/repositories/DriverRepository";
import EmployeeRepository from "../../domain/repositories/EmployeeRepository";
import RouteRepository from "../../domain/repositories/RouteRepository";
import RouteAlignmentRepository from "../../domain/repositories/RouteAlignmentRepository";
import SiteRepository from "../../domain/repositories/SiteRepository";
import TripRepository from "../../domain/repositories/TripRepository";
import UpdateAppRepository from "../../domain/repositories/UpdateAppRepository";
import UserRepository from "../../domain/repositories/UserRepository";

interface DIRepositories {
    alertRepository: AlertRepository;
    authRepository: AuthRepository;
    busRepository: BusRepository;
    defaultRepository: DefaultRepository;
    driverRepository: DriverRepository;
    employeeRepository: EmployeeRepository;
    routeRepository: RouteRepository;
    routeAlignmentRepository: RouteAlignmentRepository;
    tripRepository: TripRepository;
    siteRepository: SiteRepository;
    updateAppRepository: UpdateAppRepository;
    userRepository: UserRepository;
}

export default DIRepositories;