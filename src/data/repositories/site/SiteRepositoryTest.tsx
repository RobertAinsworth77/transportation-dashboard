import SiteEntity from "../../../domain/entities/SiteEntity";
import SiteRepository, { GetFiltredResponse } from "../../../domain/repositories/SiteRepository";

const SiteRepositoryTest: SiteRepository = {
    searchByWord: (word: string): Promise<SiteEntity[]> => new Promise<SiteEntity[]>((resolve, reject) => {
        resolve([
            {
                id: 1,
                name: 'name',
                country: 'county',
            },
            {
                id: 2,
                name: 'name2',
                country: 'county',
            },
            {
                id: 3,
                name: 'name3',
                country: 'county',
            },
        ]);
    }),
    getCountries: (): Promise<string[]> => new Promise<string[]>((resolve, reject) => {
        resolve([
            'Jamaica',
            'Colombia',
            'USA',
            'Canada',
        ]);
    }),
    getById: (id: number): Promise<SiteEntity> => new Promise<SiteEntity>((resolve, reject) => {
        resolve({
            id: 1,
            name: 'name',
            country: 'county',
        });
    }),
    getFiltred: (word: string, page: number, itemsPerPage: number): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>((resolve, reject) => {
        resolve({
            total_pages: 20,
            current_page: 10,
            total_rows: 3,
            sites: [
                {
                    id: 1,
                    name: 'name',
                    country: 'colombia',
                },
                {
                    id: 2,
                    name: 'name2',
                    country: 'jamaica',
                },
                {
                    id: 3,
                    name: 'name3',
                    country: 'county',
                }
            ]
        });
    }),
    delete: (id: number): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    update: (site: SiteEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    create: (site: SiteEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    })
}

export default SiteRepositoryTest;