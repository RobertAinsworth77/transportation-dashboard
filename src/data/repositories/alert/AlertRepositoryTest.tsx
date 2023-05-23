import AlertEntity from "../../../domain/entities/AlertEntity";
import AlertRepository from "../../../domain/repositories/AlertRepository";

const AlertRepositoryTest: AlertRepository = {
    getActiveAlerts: async (): Promise<AlertEntity[]> => new Promise<AlertEntity[]>((resolve, reject) => {
        resolve([{
            id: 1,
            tripId: 1,
            name: 'name',
            created_at: new Date(),
            position: {
                lat: 74.2,
                lng: 74.2,
            },
        }]);
    }),
    setAlertAsAttendance: async (id: number): Promise<void> => new Promise<void> ((resolve, reject) => {
        resolve();
    }),
}

export default AlertRepositoryTest;