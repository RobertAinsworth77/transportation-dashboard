import EmployeeEntity from "../../../domain/entities/EmployeeEntity";
import EmployeeRepository from "../../../domain/repositories/EmployeeRepository";
import GetEmployeeByEmailApiImpl from "./api/impl/GetEmployeeByEmailApiImpl";
import GetMultipleEmployeesByHrmIdApiImpl from "./api/impl/GetMultipleEmployeesByHrmIdApiImpl";

// const testUser = {
//     id: 1,
//     name: 'name',
//     phone: 'phone',
//     email: 'email',
//     enabled: true,
//     country: 'country',
// };

const EmployeeRepositoryDev: EmployeeRepository = {
    getByEmail: (email: string): Promise<EmployeeEntity | null> => GetEmployeeByEmailApiImpl(email),
    getMultipleByHrmId: (hrms: string[]): Promise<EmployeeEntity[] | null> => GetMultipleEmployeesByHrmIdApiImpl(hrms),
}

export default EmployeeRepositoryDev;