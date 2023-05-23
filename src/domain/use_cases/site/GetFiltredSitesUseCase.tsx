import SiteEntity from "../../entities/SiteEntity";
import SiteRepository from "../../repositories/SiteRepository";

interface props { siteRepository: SiteRepository }
export interface response {
    total_pages: number,
    current_page: number,
    total_rows: number,
    sites: SiteEntity[]
}
export default class GetFiltredSitesUseCase {
    _siteRepository: SiteRepository;

    constructor(_: props) {
        this._siteRepository = _.siteRepository;
    }

    public call = async (word: string, page: number, itemsPerPage: number) => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._siteRepository.getFiltred(word, page, itemsPerPage);
            console.log('response getfilredsitesusecase', response);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}