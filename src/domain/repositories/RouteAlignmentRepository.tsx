import RouteAlignmentEntity from "../entities/RouteAlignmentEntity";
import { OrdeByFilterEntity } from "../entities/OrdeByFilterEntity";

export default interface RouteAlignmentRepository {
  getFiltredRouteAlignments(
    searchWord: string,
    page: number,
    itemsPerPage: number,
    orderBy?: OrdeByFilterEntity,
    countryFilter?: string,
    cityFilter?: string
  ): Promise<{
    routeAlignments: RouteAlignmentEntity[];
    current_page: number;
    total_pages: number;
    total_rows: number;
    orderBy?: OrdeByFilterEntity;
    countries: string[];
    cities: string[];
  }>;
  
  getFilterOptions(): Promise<{
    countries: string[];
    cities: string[];
  }>;
  
  createRouteAlignment(routeAlignment: RouteAlignmentEntity): Promise<void>;
  updateRouteAlignment(routeAlignment: RouteAlignmentEntity): Promise<void>;
  deleteRouteAlignment(id: number): Promise<void>;
}
