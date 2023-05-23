import AlertEntity from "../../../domain/entities/AlertEntity";
import AlertRepository from "../../../domain/repositories/AlertRepository";
import AlertHostDto from "../../dto/alert/AlertHostDto";
import HostApi from "../../settings/host/HostApi";

const AlertRepositoryImpl: AlertRepository = {
    getActiveAlerts: async (): Promise<AlertEntity[]> => new Promise<AlertEntity[]>( async (resolve, reject) => {
        try {
            const response = await HostApi.get('/dashboard/alert');
            const driversMapped = response.map((driver: any) => AlertHostDto.fromJson(driver));
            return resolve(driversMapped);
        } catch (error) {
            reject(error);
        }
    }),
    setAlertAsAttendance: async (id: number): Promise<void> => new Promise<void> ( async (resolve, reject) => {
        try {
            await HostApi.put(`/dashboard/alert?id=${id}`, {});
            return resolve();    
        } catch (error) {
            return reject();
        }
}),
}

export default AlertRepositoryImpl;