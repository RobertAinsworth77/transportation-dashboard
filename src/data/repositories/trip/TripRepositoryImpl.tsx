import TripEntity, { TripState } from "../../../domain/entities/TripEntity";
import TripRepository, { GetFiltredResponse } from "../../../domain/repositories/TripRepository";
import BusHostDto from "../../dto/bus/BusHostDto";
import DriverHostDto from "../../dto/driver/DriverHostDto";
import RouteHostDto from "../../dto/route/RouteHostDto";
import SiteHostDto from "../../dto/site/SiteHostDto";
import TripHostDto from "../../dto/trip/TripHostDto";
import HostApi from "../../settings/host/HostApi";

const TripRepositoryImpl: TripRepository = {
    getFiltred: (word: string, page: number, itemsPerPage: number): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>(async (resolve, reject) => {
        const response = await HostApi.post('/admin_get_trips', {
            "items_per_page": itemsPerPage,
            "page": page,
            "search_word": word
        });
        const responseParsed = response.data.map((trip: any) => {
            const tripTemp = {
                ...TripHostDto.fromJson(trip),
                route: RouteHostDto.fromJson(trip),
                site: SiteHostDto.fromJson(trip),
                driver: DriverHostDto.fromJson(trip),
                bus: BusHostDto.fromJson(trip),
            }
            return tripTemp;
        });
        resolve({
            total_pages: response.total_pages,
            current_page: page,
            total_rows: response.total_rows,
            trips: responseParsed,
        });
    }),
    getById: (id: number): Promise<TripEntity> => new Promise<TripEntity>(async (resolve, reject) => {
        try {
            const response = await HostApi.get(`/dashboard/trips?id=${id}`);
            const driver = DriverHostDto.fromJson(response[0]);
            const bus = BusHostDto.fromJson(response[0]);
            const route = RouteHostDto.fromJson(response[0]);
            const site = SiteHostDto.fromJson(response[0]);
            route.site = site;
            const trip = TripHostDto.fromJson(response[0]);
            const tripMapped = {
                ...trip,
                driver,
                bus,
                route,
            }
            resolve(tripMapped);
        } catch (error) {
            reject(error);
        }
    }),
    delete: (id: number): Promise<void> => new Promise<void>(async (resolve, reject) => {
        try {
            await HostApi.remove(`/dashboard/trips?id=${id}`);
            resolve();
        } catch (error) {
            reject(error);
        }
    }),
    update: (trip: TripEntity): Promise<void> => new Promise<void>(async (resolve, reject) => {
        let body = TripHostDto.toJson(trip);
        let route = trip.route != undefined ? RouteHostDto.toJson(trip.route) : {};
        console.log('route of route host', route, trip.route);
        body = {...body, ...route, site_id: trip.route?.site?.id};
        if(body.route_id == 0 || body.route_id == undefined) body.route_id = "";
        console.log('llega aqui el tema del body', body, {...body, ...body.route});
        await HostApi.put(`/dashboard/trips?id=${trip.id}`, body).then((response) => {
            resolve();
        }).catch((error) => reject(error));
    }),
    create: (trip: TripEntity): Promise<void> => new Promise<void>( async (resolve, reject) => {
        let body = TripHostDto.toJson(trip);
        let route = trip.route != undefined ? RouteHostDto.toJson(trip.route) : {};
        console.log('route of route host', route, trip.route);
        body = {...body, ...route};
        if(body.route_id == 0 || body.route_id == undefined) body.route_id = "";
        console.log('llega aqui el tema del body', body, {...body, ...body.route});
        try {
            await HostApi.post('/dashboard/trips', body);
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export default TripRepositoryImpl;