import EmployeeEntity from "../entities/EmployeeEntity"

export interface GetFiltredResponse {
    total_pages: number,
    current_page: number,
    total_rows: number,
    employees: EmployeeEntity[]
}

export default interface EmployeeRepository {
    getByEmail: (email: string) => Promise<EmployeeEntity | null>
    getMultipleByHrmId: (hrms: string[]) => Promise<EmployeeEntity[] | null>
}