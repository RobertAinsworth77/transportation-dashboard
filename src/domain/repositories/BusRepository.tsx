import BusEntity from "../entities/BusEntity";

export interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    busses: BusEntity[]
}

export default interface BusRepository {
    getById: (id: number) => Promise<BusEntity>
    getFiltred: (word: string, page: number, itemsPerPage: number) => Promise<GetFiltredResponse>
    searchByWord: (word: string) => Promise<BusEntity[]>;
    delete: (id: number) => Promise<void>
    update: (driver: BusEntity) => Promise<void>
    create: (driver: BusEntity) => Promise<void>
}