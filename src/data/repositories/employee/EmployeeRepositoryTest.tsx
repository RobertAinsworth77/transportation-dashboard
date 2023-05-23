import EmployeeEntity from "../../../domain/entities/EmployeeEntity";
import EmployeeRepository, { GetFiltredResponse } from "../../../domain/repositories/EmployeeRepository";

const EmployeeRepositoryTest: EmployeeRepository = {
    getById: (id: number): Promise<EmployeeEntity> => new Promise<EmployeeEntity>((resolve, reject) => {
        resolve({
            id: 1,
            name: 'name',
            phone: 'phone',
            email: 'email',
            enabled: true,
            country: 'country',
        });
    }),
    getFiltred: (word: string, page: number, itemsPerPage: number): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>((resolve, reject) => {
        resolve({
            total_pages: 20,
            current_page: 10,
            total_rows: 3,
            employees: [
                {
                    id: 1,
                    name: 'name',
                    phone: 'phone',
                    email: 'email',
                    enabled: true,
                    country: 'country',
                },
                {
                    id: 2,
                    name: 'name2',
                    phone: 'phone',
                    email: 'email',
                    enabled: true,
                    country: 'country',
                },
                {
                    id: 3,
                    name: 'name3',
                    phone: 'phone',
                    email: 'email',
                    enabled: true,
                    country: 'country',
                }
            ]
        });
    }),
    delete: (id: number): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    update: (employee: EmployeeEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    create: (employee: EmployeeEntity, password: string): Promise<EmployeeEntity> => new Promise<EmployeeEntity>((resolve, reject) => {
        resolve({
            id: 1,
            name: 'name',
            phone: 'phone',
            email: 'email',
            enabled: true,
            country: 'country',
        });
    })
}

export default EmployeeRepositoryTest;