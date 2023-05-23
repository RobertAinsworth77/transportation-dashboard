export interface GetLastAvailableUpdateResponse {
    min_version: number,
    last_version: number,
}

export default interface UpdateAppRepository {
    getLastAvailableUpdate: () => Promise<GetLastAvailableUpdateResponse>
    getCurrentVersion: () => Promise<number>
    downloadLastAvailableUpdate: () => Promise<void>
    remindMeLaterUpdate: () => Promise<void>
    isRemindMeLaterUpdate: () => Promise<boolean>
}