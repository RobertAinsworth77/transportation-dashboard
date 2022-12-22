import AlertEntity from "../entities/AlertEntity";

export default interface AlertRepository {
    getActiveAlerts: () => Promise<AlertEntity[]>;
}