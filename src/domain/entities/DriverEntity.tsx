import BusEntity from "./BusEntity";
import UserAccountEntity from "./UserAccountEntity";

export default interface DriverEntity extends UserAccountEntity{
    last_name?: string | undefined,
    country: string,
    defaultBus?: BusEntity | undefined,
}