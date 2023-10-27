import { OrdeByFilterEntity } from "../../../domain/entities/OrdeByFilterEntity";
import PositionEntity from "../../../domain/entities/PositionEntity";
import RouteEntity from "../../../domain/entities/RouteEntity";
import RouteRepository, { GetFiltredResponse } from "../../../domain/repositories/RouteRepository";
import { GMAPS_API_KEY } from "../../../ui/utils/Constants";
import OrderByHostDto from "../../dto/orderByFilter/OrderByHostDto";
import RouteHostDto from "../../dto/route/RouteHostDto";
import HostApi from "../../settings/host/HostApi";

const LOCAL_STORAGE_ROUTE_KEY = 'routes_local';
const RouteRepositoryImpl: RouteRepository = {
    searchByWord: (word: string): Promise<RouteEntity[]> => new Promise<RouteEntity[]>(async (resolve, reject) => {
        const body = {
            "items_per_page": 20,
            "page": 1,
            "search_word": word
        }
        try {
            let response = await HostApi.post('/admin_get_routes', body);
            response = response.data.map((route: any)=>{
                return {...route, site: route};
            })
            const routesMapped = response.map((route: any) => RouteHostDto.fromJson(route));
            return resolve(routesMapped);
        } catch (error) {
            reject(error);
        }
    }),
    getFiltred: (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>(async (resolve, reject) => {
        const body = {
            "items_per_page": itemsPerPage,
            "page": page,
            "search_word": word,
            ...OrderByHostDto.toJson(orderBy, RouteHostDto.toDBColumName)
        }
        try {
            let response = await HostApi.post('/admin_get_routes', body);
            const responseMapped = response.data.map((route: any)=>{
                return {...route, site: route};
            })
            const routesParsed = responseMapped.map((route: any) => RouteHostDto.fromJson(route));
            const responseOrded = {
                total_pages: response.total_pages,
                current_page: page,
                total_rows: response.total_rows,
                routes: routesParsed,
                orderBy: OrderByHostDto.fromJson(response.order_by, RouteHostDto.fromDBColumName)
            }
            return resolve(responseOrded);
        } catch (error) {
            reject(error);
        }
    }),
    getById: (id: number): Promise<RouteEntity> => new Promise<RouteEntity>(async (resolve, reject) => {
        try {
            const response = await HostApi.get(`/dashboard/routes?id=${id}`);
            response[0].site = response[0];
            console.log('getted by api response', response);
            const routeMapped = RouteHostDto.fromJson({ ...response[0] });
            resolve(routeMapped);
        } catch (error) {
            reject(error);
        }
    }),
    delete: (id: number): Promise<void> => new Promise<void>(async (resolve, reject) => {
        try {
            await HostApi.remove(`/dashboard/routes?id=${id}`);
            resolve();
        } catch (error) {
            reject(error);
        }
    }),
    update: (route: RouteEntity): Promise<void> => new Promise<void>(async (resolve, reject) => {
        const body = RouteHostDto.toJson(route);
        try {
            await HostApi.put(`/dashboard/routes?id=${route.id}`, body);
            resolve();
        } catch (error) {
            reject(error);
        }
    }),
    create: (route: RouteEntity): Promise<void> => new Promise<void>( async (resolve, reject) => {
        let body = RouteHostDto.toJson(route);
        try {
            await HostApi.post('/dashboard/routes', body);
            resolve();
        } catch (error) {
            reject(error);
        }
    }),
    getPolylinesOfRoute: (routeId: number): Promise<PositionEntity[]> => new Promise<PositionEntity[]>((resolve, reject) => {
        resolve([]);
    }),
    getPolylinesOfRouteLocal: (routeId: number): Promise<PositionEntity[]> => new Promise<PositionEntity[]>((resolve, reject) => {
        const data = localStorage.getItem(`${LOCAL_STORAGE_ROUTE_KEY}_${routeId}`);
        if (data) {
            resolve(JSON.parse(data));
        }
        resolve([]);
    }),
    getPolylinesFromMaps: (from: PositionEntity, to: PositionEntity): Promise<PositionEntity[]> => new Promise<PositionEntity[]>(async (resolve, reject) => {
        //get from google maps
        console.log('call to get polylines of route');
        try {

            const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&key=${GMAPS_API_KEY}&travelMode=DRIVING&libraries=geometry`);
            const data = await response.json();
            try {
                const points2 = window.google.maps.geometry.encoding.decodePath(data.routes[0].overview_polyline.points);
                resolve(points2.map((point: any) => {
                    return {
                        lat: point.lat(),
                        lng: point.lng(),
                    }
                }));
                return;
            } catch (error) {
                console.log('error', error);
            }
            const points: PositionEntity[] = [];
            data.routes[0].legs[0].steps.forEach((step: any) => {
                points.push({
                    lat: step.start_location.lat,
                    lng: step.start_location.lng,
                });
                points.push({
                    lat: step.end_location.lat,
                    lng: step.end_location.lng,
                });
            });
            resolve(points);
        } catch (error) {
            resolve([]);
        }
    }),
    savePolylinesOfRoute: (routeId: number, spots: PositionEntity[]): Promise<void> => new Promise<void>((resolve, reject) => {
        localStorage.setItem(`${LOCAL_STORAGE_ROUTE_KEY}_${routeId}`, JSON.stringify(spots));
        resolve();
    }),
}

export default RouteRepositoryImpl;