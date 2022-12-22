import EmployeeEntity from "../../entities/EmployeeEntity";
import EmployeeRepository from "../../repositories/EmployeeRepository";

interface props { employeeRepository: EmployeeRepository }
export default class GetEmployeeByIdUseCase {
    _employeeRepository: EmployeeRepository;

    constructor(_: props) {
        this._employeeRepository = _.employeeRepository;
    }

    public call = async (id: number) => new Promise<EmployeeEntity>(async (resolve, reject) => {
        try {
            const response = await this._employeeRepository.getById(id);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}