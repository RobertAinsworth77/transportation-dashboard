import DefaultRepository, { GetAllCountersRelatedToTripResponse, GetAllKindUsersCountResponse } from "../../../domain/repositories/DefaultRepository";
import HostApi from "../../settings/host/HostApi";

const DefaultRepositoryImpl: DefaultRepository = {
    getAllKindUsersCount: (): Promise<GetAllKindUsersCountResponse> => new Promise<GetAllKindUsersCountResponse>(async (resolve, reject) => {
        try {
            const response = await HostApi.post('/admin_get_users_count', {});
            const responseParsed = JSON.parse(response.data.replaceAll("'", '"'));
            const converted = {
                users_count: responseParsed.number_admins,
                drivers_count: responseParsed.number_drivers,
                employees_count: responseParsed.number_employees,
            };
            return resolve(converted);
        } catch (error) {
            reject(error);
        }
    }),
    getAllCountersRelatedToTrip: (): Promise<GetAllCountersRelatedToTripResponse> => new Promise<GetAllCountersRelatedToTripResponse>(async (resolve, reject) => {
        try {
            const response = await HostApi.get('/dashboard/trips/getallcount');
            const responseParsed = JSON.parse(response.replaceAll("'", '"'));
            const converted = {
                sites_count: responseParsed?.sites_count,
                busses_count: responseParsed?.vehicles_count,
                trips_count: responseParsed?.trips_count,
                routes_count: responseParsed?.routes_count,
            };
            return resolve(converted);
        } catch (error) {
            reject(error);
        }
    }),
    


}

export default DefaultRepositoryImpl;