import PositionEntity from "./PositionEntity";

export default interface AlertEntity {
    id: number,
    name: string,
    created_at: Date,
    position: PositionEntity;
    tripId: number,
}