import UserAccountEntity from "./UserAccountEntity";

export default interface DriverEntity extends UserAccountEntity{
    country: string,
    default_bus_plate: string | null,
}