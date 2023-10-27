import EmployeeEntity from "../../../domain/entities/EmployeeEntity";
import { OrdeByFilterEntity } from "../../../domain/entities/OrdeByFilterEntity";
import TripEntity, { TripState } from "../../../domain/entities/TripEntity";
import TripRepository, { GetFiltredResponse } from "../../../domain/repositories/TripRepository";
import BusHostDto from "../../dto/bus/BusHostDto";
import DriverHostDto from "../../dto/driver/DriverHostDto";
import EmployeeHostDto from "../../dto/employee/EmployeeHostDto";
import OrderByHostDto from "../../dto/orderByFilter/OrderByHostDto";
import RouteHostDto from "../../dto/route/RouteHostDto";
import SiteHostDto from "../../dto/site/SiteHostDto";
import TripHostDto from "../../dto/trip/TripHostDto";
import HostApi from "../../settings/host/HostApi";

const TripRepositoryImpl: TripRepository = {
    getFiltred: (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>(async (resolve, reject) => {
        const response = await HostApi.post('/admin_get_trips', {
            "items_per_page": itemsPerPage,
            "page": page,
            "search_word": word,
            ...OrderByHostDto.toJson(orderBy, TripHostDto.toDBColumName)
        });
        const responseParsed = response.data.map((trip: any) => {
            const tripTemp = {
                ...TripHostDto.fromJson(trip),
                route: RouteHostDto.fromJson(trip),
                site: SiteHostDto.fromJson(trip),
                driver: DriverHostDto.fromJson(trip),
                bus: BusHostDto.fromJson(trip),
            };
            return tripTemp;
        });
        resolve({
            total_pages: response.total_pages,
            current_page: page,
            total_rows: response.total_rows,
            trips: responseParsed,
            orderBy: OrderByHostDto.fromJson(response.order_by, TripHostDto.fromDBColumName)
        });
    }),
    getById: (id: number): Promise<TripEntity> => new Promise<TripEntity>(async (resolve, reject) => {
        try {
            const responseText = await HostApi.get(`/dashboard/trips?id=${id}`);
            const replaced = responseText.replace(/'/g, '"').replace(/\\xa0/g, '\\n');
            const response = JSON.parse(replaced);
            const driver = DriverHostDto.fromJson(response);
            const bus = BusHostDto.fromJson(response);
            const route = RouteHostDto.fromJson(response);
            const site = SiteHostDto.fromJson(response);
            route.site = site;
            const trip = TripHostDto.fromJson(response);
            const tripMapped = {
                ...trip,
                driver,
                bus,
                route,
            };
            resolve(tripMapped);
        } catch (error) {
            console.log('error', error);
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
        body = { ...body, ...route, site_id: trip.route?.site?.id };
        if (body.route_id == 0 || body.route_id == undefined)
            body.route_id = "";
        console.log('llega aqui el tema del body', body, { ...body, ...body.route });
        await HostApi.put(`/dashboard/trips?id=${trip.id}`, body).then((response) => {
            resolve();
        }).catch((error) => reject(error));
    }),
    create: (trip: TripEntity): Promise<void> => new Promise<void>(async (resolve, reject) => {
        let body = TripHostDto.toJson(trip);
        let route = trip.route != undefined ? RouteHostDto.toJson(trip.route) : {};
        console.log('route of route host', route, trip.route);
        body = { ...body, ...route };
        if (body.route_id == 0 || body.route_id == undefined)
            body.route_id = "";
        console.log('llega aqui el tema del body', body, { ...body, ...body.route });
        try {
            await HostApi.post('/dashboard/trips', body);
            resolve();
        } catch (error) {
            reject(error);
        }
    }),
    getPassengersByTripId: (id: number): Promise<EmployeeEntity[]> => new Promise<EmployeeEntity[]>(async (resolve, reject) => {
        try {
            const response = await HostApi.get(`/dashboard/trips/passengers?id=${id}`);
            const responseParsed = response.map((passenger: any) => EmployeeHostDto.fromJson(passenger));
            resolve(responseParsed);
        } catch (error) {
            reject(error);
        }
    }),
}

export default TripRepositoryImpl;