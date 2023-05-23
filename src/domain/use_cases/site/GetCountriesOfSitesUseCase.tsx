import SiteEntity from "../../entities/SiteEntity";
import SiteRepository from "../../repositories/SiteRepository";

interface props { siteRepository: SiteRepository }
export default class GetCountriesOfSitesUseCase {
    _siteRepository: SiteRepository;

    constructor(_: props) {
        this._siteRepository = _.siteRepository;
    }

    public call = async () => new Promise<string[]>(async (resolve, reject) => {
        try {
            const response = await this._siteRepository.getCountries();
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}