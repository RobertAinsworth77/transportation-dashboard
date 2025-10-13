import RouteAlignmentEntity from "../../../../../domain/entities/RouteAlignmentEntity";

export default interface AddRouteAlignmentModalComponentProps {
  routeAlignment?: RouteAlignmentEntity;
  done: () => void;
}
