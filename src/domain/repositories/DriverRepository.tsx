import DriverEntity from "../entities/DriverEntity";
import { OrdeByFilterEntity } from "../entities/OrdeByFilterEntity";

export interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    drivers: DriverEntity[],
    orderBy: OrdeByFilterEntity | undefined,
}

export default interface DriverRepository {
    searchByWord: (word: string) => Promise<DriverEntity[]>;
    getFiltred: (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined) => Promise<GetFiltredResponse>
    getById: (id: number) => Promise<DriverEntity>
    delete: (id: number) => Promise<void>
    update: (driver: DriverEntity) => Promise<void>
    create: (driver: DriverEntity) => Promise<void>
}