import PositionEntity from "./PositionEntity";

export default interface RouteEntity {
    id: number,
    name: string,
    description: string,
    enabled: boolean,
    route: PositionEntity[]
}