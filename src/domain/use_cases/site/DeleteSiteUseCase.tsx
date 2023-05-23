import SiteRepository from "../../repositories/SiteRepository";

interface props { siteRepository: SiteRepository }
export default class DeleteSiteUseCase {
    _siteRepository: SiteRepository;

    constructor(_: props) {
        this._siteRepository = _.siteRepository;
    }

    public call = async (id: number) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._siteRepository.delete(id);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}