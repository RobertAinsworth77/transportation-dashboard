import UpdateAppRepository, { GetLastAvailableUpdateResponse } from "../../../domain/repositories/UpdateAppRepository";
import { CURRENT_VERSION } from "../../../ui/utils/Constants";
import HostApi from "../../settings/host/HostApi";

const REMIND_ME_LATER_UPDATE_KEY:string = 'remind_me_later_update';

const UpdateAppRepositoryImpl: UpdateAppRepository = {
    getLastAvailableUpdate: function (): Promise<GetLastAvailableUpdateResponse> {
        return new Promise<GetLastAvailableUpdateResponse>(async (resolve, reject) => {
            try {
                const response = await HostApi.get('/dashboard/version');
                const converted = {
                    min_version: response[0].min_version,
                    last_version: response[0].last_version,
                };
                return resolve(converted);
            } catch (error) {
                reject(error);
            }
        });
    },
    getCurrentVersion: function (): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            try {
                return resolve(CURRENT_VERSION);
            } catch (error) {
                reject(error);
            }
        });
    },

    downloadLastAvailableUpdate: (): Promise<void> => new Promise<void>(async (resolve, reject) => {
        const sharePointLocation = "https://itelbposmartsolutions.sharepoint.com/sites/Automations/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FAutomations%2FShared%20Documents%2FTransportation%20Admin%20Module&viewid=9b04779c%2Dcf8d%2D47b0%2D8862%2Dbb20e367d99c";
        window.location.href = sharePointLocation;
    }),

    remindMeLaterUpdate: (): Promise<void> => new Promise<void>(async (resolve, reject) => {
        //no remind until tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        localStorage.setItem(REMIND_ME_LATER_UPDATE_KEY, tomorrow.toISOString());
        return resolve();
    }),

    isRemindMeLaterUpdate: (): Promise<boolean> => new Promise<boolean>(async (resolve, reject) => {
        const remindMeLaterUpdate = localStorage.getItem(REMIND_ME_LATER_UPDATE_KEY);
        if (remindMeLaterUpdate) {
            const remindMeLaterUpdateDate = new Date(remindMeLaterUpdate);
            const now = new Date();
            if (remindMeLaterUpdateDate < now) {
                return resolve(true);
            }else{
                return resolve(false);
            }
        }else{
            return resolve(true);
        }
    }),
}

export default UpdateAppRepositoryImpl;