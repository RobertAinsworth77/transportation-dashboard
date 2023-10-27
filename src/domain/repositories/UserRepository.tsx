import { OrdeByFilterEntity } from "../entities/OrdeByFilterEntity"
import UserEntity from "../entities/UserEntity"

export interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    orderBy: OrdeByFilterEntity | undefined,
    users: UserEntity[]
}
export default interface UserRepository {
    getFiltred: (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined) => Promise<GetFiltredResponse>
    getById: (id: number) => Promise<UserEntity>
    delete: (id: number) => Promise<void>
    update: (driver: UserEntity) => Promise<void>
    create: (driver: UserEntity) => Promise<void>
}