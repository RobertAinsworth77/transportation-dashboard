import TripEntity from "../entities/TripEntity"

export interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    trips: TripEntity[]
}
export default interface TripRepository {
    getFiltred: (word: string, page: number, itemsPerPage: number) => Promise<GetFiltredResponse>
    getById: (id: number) => Promise<TripEntity>
    delete: (id: number) => Promise<void>
    update: (trip: TripEntity) => Promise<void>
    create: (trip: TripEntity) => Promise<void>
}