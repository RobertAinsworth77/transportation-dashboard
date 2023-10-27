import BusEntity from "./BusEntity";
import DriverEntity from "./DriverEntity";
import EmployeeEntity from "./EmployeeEntity";
import PositionEntity from "./PositionEntity";
import RouteEntity from "./RouteEntity";

export enum TripState {
    pending = 'pending',
    inProgress = 'in progress',
    canceled = 'canceled',
    completed = 'completed'
}

export default interface TripEntity {
    id: number,
    start_date: Date,
    end_date: Date | undefined,
    state: TripState,
    driver_id: number | undefined,
    bus_id: number | undefined,
    route_id: number | undefined,
    passengers_count: number,
    bookings_pending_count: number,
    driver: DriverEntity | undefined,
    bus: BusEntity | undefined,
    route: RouteEntity | undefined,
    passengers: EmployeeEntity[],
    bookings: EmployeeEntity[],
    position: PositionEntity | undefined,
    canDelete?: boolean,
    canEdit?: boolean,
}