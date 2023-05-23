import DefaultRepository, { GetAllCountersRelatedToTripResponse, GetAllKindUsersCountResponse } from "../../../domain/repositories/DefaultRepository";

const DefaultRepositoryTest:DefaultRepository = {
    getAllKindUsersCount: (): Promise<GetAllKindUsersCountResponse> => new Promise<GetAllKindUsersCountResponse>((resolve, reject) => {
        resolve({
            users_count: 15,
            drivers_count: 18,
            employees_count: 145,
        });
    }),
    getAllCountersRelatedToTrip: (): Promise<GetAllCountersRelatedToTripResponse> => new Promise<GetAllCountersRelatedToTripResponse>((resolve, reject) => {
        resolve({
            sites_count: 5,
            busses_count: 23,
            trips_count: 21,
            routes_count: 5,
        });
    }),
}

export default DefaultRepositoryTest;