import PositionEntity from "../../../domain/entities/PositionEntity";

export default interface RouteMapComponentProps {
    editable?: boolean;
    busStop?: PositionEntity | undefined;
    siteStop?: PositionEntity | undefined;
    busPosition?: PositionEntity | undefined;
    onChangeBusStop?: (position: PositionEntity) => void | undefined;
    onChangeSiteStop?: (position: PositionEntity) => void | undefined;
    show?: boolean;
    routeId?: number | undefined;
    onChangePolylines?: (polylines: PositionEntity[] | undefined)=>void;
}