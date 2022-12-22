import EmployeeEntity from "../entities/EmployeeEntity"

export interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    employees: EmployeeEntity[]
}

export default interface EmployeeRepository {
    getFiltred: (word: string, page: number, itemsPerPage: number) => Promise<GetFiltredResponse>
    getById: (id: number) => Promise<EmployeeEntity>
    delete: (id: number) => Promise<void>
    update: (driver: EmployeeEntity) => Promise<EmployeeEntity>
    create: (driver: EmployeeEntity, password: string) => Promise<EmployeeEntity>
}