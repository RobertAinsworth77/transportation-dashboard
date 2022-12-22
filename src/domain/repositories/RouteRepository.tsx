import RouteEntity from "../entities/RouteEntity";

interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    routeses: RouteEntity[]
}
export default interface RouteRepository {
    searchByWord: (word: string) => Promise<RouteEntity[]>;
    getFiltred: (word: string, page: number, itemsPerPage: number) => Promise<GetFiltredResponse>
    getById: (id: number) => Promise<RouteEntity>
    delete: (id: number) => Promise<void>
    update: (driver: RouteEntity) => Promise<RouteEntity>
    create: (driver: RouteEntity, password: string) => Promise<RouteEntity>
}