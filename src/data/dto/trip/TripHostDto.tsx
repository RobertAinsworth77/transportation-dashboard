import TripEntity, { TripState } from "../../../domain/entities/TripEntity";
import DateParse from "../../../ui/utils/DateParse";
import BusHostDto from "../bus/BusHostDto";
import DriverHostDto from "../driver/DriverHostDto";
import EmployeeHostDto from "../employee/EmployeeHostDto";
import PositionHostDto from "../position/PositionHostDto";
import RouteHostDto from "../route/RouteHostDto";

const toJson = (trip: TripEntity): any => {
    return {
        trip_id: trip.id,
        date_begin: DateParse.formatDate(trip.start_date),
        date_end: trip.end_date ?  DateParse.formatDate(trip.end_date) : undefined,
        status: trip.state == TripState.inProgress
            ? 'in progress'
            : trip.state == TripState.ended
                ? 'completed'
                : trip.state == TripState.pending
                    ? 'pending'
                    : 'pending',
        driver_id: trip.driver?.id ??trip.driver_id,
        vehicle_id: trip.bus?.id ?? trip.bus_id,
        route_id: trip.route?.id ?? trip.route_id,
        passengers_count: trip.passengers_count,
        reserves_pending_count: trip.bookings_pending_count,
        driver: trip.driver != null ? DriverHostDto.toJson(trip.driver) : undefined,
        vehicle: trip.bus != null ? BusHostDto.toJson(trip.bus) : undefined,
        route: trip.route != null ? RouteHostDto.toJson(trip.route) : undefined,
        passengers: trip.passengers != null ? trip.passengers.map((passenger) => EmployeeHostDto.toJson(passenger)) : [],
        reserves_pending: trip.bookings != null ? trip.bookings.map((booking) => EmployeeHostDto.toJson(booking)) : [],
        position: trip.position != null ? PositionHostDto.toJson(trip.position) : undefined,
        canEdit: trip.canEdit,
        canDelete: trip.canDelete,
    }
}

const fromJson = (json: any): TripEntity => {
    return {
        id: json.trip_id,
        start_date: DateParse.stringToDate(json.date_begin),
        end_date: DateParse.stringToDate(json.date_end),
        state: json.status == 'progress' || json.status?.toLowerCase() == 'in progress'
        ? TripState.inProgress
        : json.status == 'completed'
            ? TripState.ended
            : json.status == 'pending'
                ? TripState.pending
                : TripState.pending,
        driver_id: json.driver_id,
        bus_id: json.vehicle_id,
        route_id: json.route_id,
        passengers_count: json.passengers_count,
        bookings_pending_count: json.reserves_pending_count,
        driver: json.driver != null ? DriverHostDto.fromJson(json.driver) : undefined,
        bus: json.vehicle != null ? BusHostDto.fromJson(json.vehicle) : undefined,
        route: json.route != null ? RouteHostDto.fromJson(json.route) : undefined,
        passengers: json.passengers != null ? json.passengers.map((passenger: any) => EmployeeHostDto.fromJson(passenger)) : [],
        bookings: json.reserves != null ? json.reserves.map((booking: any) => EmployeeHostDto.fromJson(booking)) : [],
        position: json.position != null ? PositionHostDto.fromJson(json.position) : undefined,
        canDelete: json.status != 'completed',
        canEdit: json.status != 'completed' && json.status != 'in progress',
    }
}

const TripHostDto = {
    toJson,
    fromJson,
}

export default TripHostDto;