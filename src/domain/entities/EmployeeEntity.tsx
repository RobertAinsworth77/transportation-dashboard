import UserAccountEntity from "./UserAccountEntity";

export enum EmployeePassengerStatus {
    PENDING = 'pending',
    CANCELED = 'canceled',
    COMPLETED = 'completed',
}
export default interface EmployeeEntity extends UserAccountEntity {
    country: string,
    passengerStatus?: EmployeePassengerStatus | undefined,
}