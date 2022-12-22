import UserEntity from "../entities/UserEntity"

interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    users: UserEntity[]
}
export default interface UserRepository {
    getFiltred: (word: string, page: number, itemsPerPage: number) => Promise<GetFiltredResponse>
    getById: (id: number) => Promise<UserEntity>
    delete: (id: number) => Promise<void>
    update: (driver: UserEntity) => Promise<UserEntity>
    create: (driver: UserEntity, password: string) => Promise<UserEntity>
}