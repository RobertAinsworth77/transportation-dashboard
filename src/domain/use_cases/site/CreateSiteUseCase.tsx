import SiteEntity from "../../entities/SiteEntity";
import SiteRepository from "../../repositories/SiteRepository";

interface props { siteRepository: SiteRepository }
export default class CreateSiteUseCase {
    _siteRepository: SiteRepository;

    constructor(_: props) {
        this._siteRepository = _.siteRepository;
    }

    public call = async (site: SiteEntity) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._siteRepository.create(site);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}