import SiteEntity from "../../entities/SiteEntity";
import SiteRepository from "../../repositories/SiteRepository";

interface props { siteRepository: SiteRepository }
export default class SearchSitesByNameUseCase {
    _siteRepository: SiteRepository;

    constructor(_: props) {
        this._siteRepository = _.siteRepository;
    }

    public call = async (word: string) => new Promise<SiteEntity[]>(async (resolve, reject) => {
        try {
            const response = await this._siteRepository.searchByWord(word);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}