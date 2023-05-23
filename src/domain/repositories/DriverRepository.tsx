import DriverEntity from "../entities/DriverEntity";

export interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    drivers: DriverEntity[]
}

export default interface DriverRepository {
    searchByWord: (word: string) => Promise<DriverEntity[]>;
    getFiltred: (word: string, page: number, itemsPerPage: number) => Promise<GetFiltredResponse>
    getById: (id: number) => Promise<DriverEntity>
    delete: (id: number) => Promise<void>
    update: (driver: DriverEntity) => Promise<void>
    create: (driver: DriverEntity, password: string) => Promise<void>
}