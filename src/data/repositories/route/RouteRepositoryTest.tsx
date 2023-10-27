import { resolve } from "node:path/win32";
import PositionEntity from "../../../domain/entities/PositionEntity";
import RouteEntity from "../../../domain/entities/RouteEntity";
import RouteRepository, { GetFiltredResponse } from "../../../domain/repositories/RouteRepository";
import { GMAPS_API_KEY } from "../../../ui/utils/Constants";

const LOCAL_STORAGE_ROUTE_KEY = 'routes_local';
const RouteRepositoryTest: RouteRepository = {
    searchByWord: (word: string): Promise<RouteEntity[]> => new Promise<RouteEntity[]>((resolve, reject) => {
        resolve([
            {
                id: 1,
                name: 'name',
                description: 'description',
                enabled: true,
                polylines: undefined,
                start_point: {
                    lat: 74.5,
                    lng: 74.5,
                },
                end_point: {
                    lat: 74.5,
                    lng: 74.5,
                },
                site: {
                    id: 2,
                    name: 'name',
                    country: 'address',
                }
            },
            {
                id: 2,
                name: 'name2',
                description: 'description',
                enabled: true,
                polylines: undefined,
                start_point: {
                    lat: 74.5,
                    lng: 74.5,
                },
                end_point: {
                    lat: 74.5,
                    lng: 74.5,
                },
                site: {
                    id: 2,
                    name: 'name',
                    country: 'address',
                }
            },
        ]);
    }),
    getFiltred: (word: string, page: number, itemsPerPage: number): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>((resolve, reject) => {
        resolve({
            total_pages: 12,
            current_page: 2,
            total_rows: 2,
            orderBy: {
                keyName: 'id',
                isDesc: false,
            },
            routes: [
                {
                    id: 1,
                    name: 'name',
                    description: 'description',
                    enabled: true,
                    polylines: undefined,
                    start_point: {
                        lat: 74.5,
                        lng: 74.5,
                    },
                    end_point: {
                        lat: 74.5,
                        lng: 74.5,
                    },
                },
                {
                    id: 2,
                    name: 'name2',
                    description: 'description',
                    enabled: true,
                    polylines: undefined,
                    start_point: {
                        lat: 74.5,
                        lng: 74.5,
                    },
                    end_point: {
                        lat: 74.5,
                        lng: 74.5,
                    },
                },
            ]
        });
    }),
    getById: (id: number): Promise<RouteEntity> => new Promise<RouteEntity>((resolve, reject) => {
        resolve({
            id: 1,
            name: 'name',
            description: 'description',
            enabled: true,
            site_id: 1,
            polylines: undefined,
            site: {
                id: 2,
                name: 'name',
                country: 'address',
            },
            start_point: {
                lat: 74.5,
                lng: 74.5,
            },
            end_point: {
                lat: 74.5,
                lng: 74.5,
            },
        });
    }),
    delete: (id: number): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    update: (driver: RouteEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    create: (route: RouteEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
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

export default RouteRepositoryTest;