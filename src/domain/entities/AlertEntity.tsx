import DriverEntity from "./DriverEntity";
import EmployeeEntity from "./EmployeeEntity";
import PositionEntity from "./PositionEntity";

export default interface AlertEntity {
    id: number,
    name: string,
    created_at: Date,
    position: PositionEntity;
    creator: DriverEntity | EmployeeEntity
}