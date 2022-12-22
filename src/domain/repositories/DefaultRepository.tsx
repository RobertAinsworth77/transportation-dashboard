export interface GetAllKindUsersCountResponse {
    busses_count: number,
    trips_count: number,
    routes_count: number,
}

export interface GetAllCountersRelatedToTripResponse {
    busses_count: number,
    trips_count: number,
    routes_count: number,
}

export default interface DefaultRepository {
    getAllKindUsersCount: () => Promise<GetAllKindUsersCountResponse>
    getAllCountersRelatedToTrip: () => Promise<GetAllCountersRelatedToTripResponse>
}