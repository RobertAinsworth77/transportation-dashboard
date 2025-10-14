import EmployeeEntity from "../entities/EmployeeEntity"
import { OrdeByFilterEntity } from "../entities/OrdeByFilterEntity"
import TripEntity from "../entities/TripEntity"

export interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    trips: TripEntity[],
    orderBy: OrdeByFilterEntity | undefined,
    statuses?: string[],
    drivers?: string[],
    routes?: string[]
}
export default interface TripRepository {
    getFiltred: (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined, statusFilter?: string, driverFilter?: string, routeFilter?: string) => Promise<GetFiltredResponse>
    getById: (id: number) => Promise<TripEntity>
    delete: (id: number) => Promise<void>
    update: (trip: TripEntity) => Promise<void>
    create: (trip: TripEntity) => Promise<void>
    getPassengersByTripId: (id: number) => Promise<EmployeeEntity[]>
}