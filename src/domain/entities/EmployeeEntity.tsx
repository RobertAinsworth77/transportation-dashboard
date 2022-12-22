import UserAccountEntity from "./UserAccountEntity";

export default interface EmployeeEntity extends UserAccountEntity {
    country: string,
}