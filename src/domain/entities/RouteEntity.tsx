import PositionEntity from "./PositionEntity";
import SiteEntity from "./SiteEntity";

export default interface RouteEntity {
    id: number,
    name: string,
    description: string,
    enabled: boolean,
    start_point: PositionEntity,
    end_point: PositionEntity,
    site?: SiteEntity
    site_id?: number
    polylines: PositionEntity[] | undefined;
}