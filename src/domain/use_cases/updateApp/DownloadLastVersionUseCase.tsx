import UpdateAppRepository from "../../repositories/UpdateAppRepository";

interface props { updateAppRepository: UpdateAppRepository }

export default class DownloadLastVersionUseCase {
    _updateAppRepository: UpdateAppRepository;

    constructor(_: props) {
        this._updateAppRepository = _.updateAppRepository;
    }

    public call = async () => new Promise<void>(async (resolve, reject) => {
        try {
            this._updateAppRepository.downloadLastAvailableUpdate();
        }
        catch (error) {
            return reject();
        }
    });
}