import EmployeeEntity from "../../entities/EmployeeEntity";
import EmployeeRepository from "../../repositories/EmployeeRepository";

interface props { employeeRepository: EmployeeRepository }
export default class GetEmployeesByHrmUseCase {
    _employeeRepository: EmployeeRepository;

    constructor(_: props) {
        this._employeeRepository = _.employeeRepository;
    }

    public call = async (hrms: string[]) => new Promise<EmployeeEntity[] | null>(async (resolve, reject) => {
        try {
            const response = await this._employeeRepository.getMultipleByHrmId(hrms);
            console.log('response in use case', response);
            return resolve(response);
        } catch (_) {
            console.log('error in usecase', _)
            return reject();
        }
    });
}