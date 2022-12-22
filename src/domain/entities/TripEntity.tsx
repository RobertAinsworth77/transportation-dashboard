import BusEntity from "./BusEntity";
import DriverEntity from "./DriverEntity";
import EmployeeEntity from "./EmployeeEntity";
import RouteEntity from "./RouteEntity";

enum TripState {
    pending = 'pending',
    inProgress = 'in progress',
    canceled = 'canceled',
    ended = 'ended'
}

export default interface TripEntity {
    id: number,
    start_date: Date,
    end_date: Date,
    state: TripState,
    driver_id: number | undefined,
    bus_id: number | undefined,
    route_id: number | undefined,
    passengers_count: number,
    reserves_pending_count: number,
    driver: DriverEntity | undefined,
    bus: BusEntity | undefined,
    route: RouteEntity | undefined,
    passengers: EmployeeEntity[],
}