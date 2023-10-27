import EmployeeEntity from "../../../domain/entities/EmployeeEntity";
import EmployeeRepository, { GetFiltredResponse } from "../../../domain/repositories/EmployeeRepository";

const testUser = {
    id: 1,
    name: 'name',
    phone: 'phone',
    email: 'email',
    enabled: true,
    country: 'country',
};
const EmployeeRepositoryTest: EmployeeRepository = {
    getByEmail: (email: string): Promise<EmployeeEntity | null> => new Promise<EmployeeEntity | null>((resolve, reject) => {
        resolve(testUser);
    }),
    getMultipleByHrmId: (hrms: string[]): Promise<EmployeeEntity[] | null> => new Promise<EmployeeEntity[] | null>((resolve, reject) => {
        resolve([testUser, testUser]);
    }),
}

export default EmployeeRepositoryTest;