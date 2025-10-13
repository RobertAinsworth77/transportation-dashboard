import RouteAlignmentEntity from "../entities/RouteAlignmentEntity";
import { OrdeByFilterEntity } from "../entities/OrdeByFilterEntity";

export default interface RouteAlignmentRepository {
  getFiltredRouteAlignments(
    searchWord: string,
    page: number,
    itemsPerPage: number,
    orderBy?: OrdeByFilterEntity
  ): Promise<{
    routeAlignments: RouteAlignmentEntity[];
    current_page: number;
    total_pages: number;
    total_rows: number;
    orderBy?: OrdeByFilterEntity;
  }>;
  
  createRouteAlignment(routeAlignment: RouteAlignmentEntity): Promise<void>;
  updateRouteAlignment(routeAlignment: RouteAlignmentEntity): Promise<void>;
  deleteRouteAlignment(id: number): Promise<void>;
}
