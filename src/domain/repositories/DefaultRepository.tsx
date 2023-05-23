export interface GetAllKindUsersCountResponse {
    users_count: number,
    drivers_count: number,
    employees_count: number,
}

export interface GetAllCountersRelatedToTripResponse {
    busses_count: number,
    trips_count: number,
    routes_count: number,
    sites_count: number,
}

export default interface DefaultRepository {
    getAllKindUsersCount: () => Promise<GetAllKindUsersCountResponse>
    getAllCountersRelatedToTrip: () => Promise<GetAllCountersRelatedToTripResponse>
}