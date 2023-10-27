import { OrdeByFilterEntity } from "../entities/OrdeByFilterEntity";
import SiteEntity from "../entities/SiteEntity";

export interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    sites: SiteEntity[],
    orderBy: OrdeByFilterEntity | undefined,
}
export default interface SiteRepository {
    searchByWord: (word: string) => Promise<SiteEntity[]>;
    getCountries: () => Promise<string[]>;
    getFiltred: (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined) => Promise<GetFiltredResponse>
    getById: (id: number) => Promise<SiteEntity>
    delete: (id: number) => Promise<void>
    update: (driver: SiteEntity) => Promise<void>
    create: (driver: SiteEntity) => Promise<void>

}