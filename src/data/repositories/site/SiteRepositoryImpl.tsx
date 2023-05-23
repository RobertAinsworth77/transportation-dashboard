import SiteEntity from "../../../domain/entities/SiteEntity";
import SiteRepository, { GetFiltredResponse } from "../../../domain/repositories/SiteRepository";
import SiteHostDto from "../../dto/site/SiteHostDto";
import HostApi from "../../settings/host/HostApi";

const SiteRepositoryImpl: SiteRepository = {
    searchByWord: (word: string): Promise<SiteEntity[]> => new Promise<SiteEntity[]>(async (resolve, reject) => {
        const response = await HostApi.get('/admin_get_sites');
        const responseParsedDto = response.map((site: any) => SiteHostDto.fromJson(site)).filter((site: SiteEntity) => site.name.includes(word));
        resolve(responseParsedDto);
    }),
    getCountries: (): Promise<string[]> => new Promise<string[]>( async (resolve, reject) => {
        try {
            const response = await HostApi.post('/employee_get_countries', {});
            resolve(response.data.map((country: any) => country.country));
        } catch (error) {
            reject(error);
        }
    }),
    getById: (id: number): Promise<SiteEntity> => new Promise<SiteEntity>(async (resolve, reject) => {
        try {
            const response = await HostApi.get(`/dashboard/sites?id=${id}`);
            const siteMapped = SiteHostDto.fromJson({ ...response[0] });
            resolve(siteMapped);
        } catch (error) {
            reject(error);
        }
    }),
    getFiltred: (word: string, page: number, itemsPerPage: number): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>(async (resolve, reject) => {
        const response = await HostApi.get('/admin_get_sites');
        const responseParsedDto = response.filter((site: any) => JSON.stringify(site).includes(word)).map((site: any) => SiteHostDto.fromJson(site));
        resolve({
            total_pages: 1,
            current_page: 1,
            total_rows: responseParsedDto.length,
            sites: responseParsedDto
        });
    }),
    delete: (id: number): Promise<void> => new Promise<void>( async (resolve, reject) => {
        try {
            await HostApi.post('/dashboard/sites/delete', { site_id: id });
            resolve();
        } catch (error) {
            reject(error);
        }
    }),
    update: (site: SiteEntity): Promise<void> => new Promise<void>(async (resolve, reject) => {
        const body = SiteHostDto.toJson(site);
        try {
            await HostApi.post(`/dashboard/sites/edit`, body);
            resolve();
        } catch (error) {
            reject(error);
        }
    }),
    create: (site: SiteEntity): Promise<void> => new Promise<void>(async (resolve, reject) => {
        const body = SiteHostDto.toJson(site);
        body.site_id = undefined;
        try {
            await HostApi.post('/dashboard/sites/add', body);
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export default SiteRepositoryImpl;