import PositionEntity from "../entities/PositionEntity";
import RouteEntity from "../entities/RouteEntity";

export interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    routes: RouteEntity[]
}
export default interface RouteRepository {
    searchByWord: (word: string) => Promise<RouteEntity[]>;
    getFiltred: (word: string, page: number, itemsPerPage: number) => Promise<GetFiltredResponse>
    getById: (id: number) => Promise<RouteEntity>
    delete: (id: number) => Promise<void>
    update: (driver: RouteEntity) => Promise<void>
    create: (driver: RouteEntity) => Promise<void>

    getPolylinesOfRoute(routeId: number): Promise<PositionEntity[]>;
    getPolylinesOfRouteLocal(routeId: number): Promise<PositionEntity[]>;
    getPolylinesFromMaps(from: PositionEntity, to: PositionEntity): Promise<PositionEntity[]>;
    savePolylinesOfRoute(routeId: number, spots: PositionEntity[]): Promise<void>;

}