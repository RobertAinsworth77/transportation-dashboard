import UpdateAppRepository from "../../repositories/UpdateAppRepository";

interface props { updateAppRepository: UpdateAppRepository }

export enum response {
    UPDATE_AVAILABLE = "UPDATE_AVAILABLE",
    UPDATE_NOT_AVAILABLE = "UPDATE_NOT_AVAILABLE",
    UPDATE_REQUIRED = "UPDATE_REQUIRED",
}

export default class CheckIfUpdateUseCase {
    _updateAppRepository: UpdateAppRepository;

    constructor(_: props) {
        this._updateAppRepository = _.updateAppRepository;
    }

    public call = async () => new Promise<response>(async (resolve, reject) => {
        try {
            const curentVersion = await this._updateAppRepository.getCurrentVersion();
            const updates = await this._updateAppRepository.getLastAvailableUpdate();
            if (updates.last_version > curentVersion) {
                if (updates.min_version > curentVersion) {
                    return resolve(response.UPDATE_REQUIRED);
                } else {
                    const isRemind = await this._updateAppRepository.isRemindMeLaterUpdate();
                    if(isRemind) return resolve(response.UPDATE_AVAILABLE);
                    return resolve(response.UPDATE_NOT_AVAILABLE);
                }
            }else {
                return resolve(response.UPDATE_NOT_AVAILABLE);
            }
        }
        catch (error) {
            return resolve(response.UPDATE_NOT_AVAILABLE);
        }
    });
}