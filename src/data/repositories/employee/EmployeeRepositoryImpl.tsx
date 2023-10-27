import EmployeeEntity from "../../../domain/entities/EmployeeEntity";
import EmployeeRepository, { GetFiltredResponse } from "../../../domain/repositories/EmployeeRepository";
import GetEmployeeByEmailApiImpl from "./api/impl/GetEmployeeByEmailApiImpl";
import GetMultipleEmployeesByHrmIdApiImpl from "./api/impl/GetMultipleEmployeesByHrmIdApiImpl";

const EmployeeRepositoryImpl: EmployeeRepository = {
    getByEmail: (email: string): Promise<EmployeeEntity | null> => GetEmployeeByEmailApiImpl(email),
    getMultipleByHrmId: (hrms: string[]): Promise<EmployeeEntity[] | null> => GetMultipleEmployeesByHrmIdApiImpl(hrms),
}

export default EmployeeRepositoryImpl;