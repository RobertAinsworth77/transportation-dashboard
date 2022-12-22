import EmployeeEntity from "../../entities/EmployeeEntity";
import EmployeeRepository from "../../repositories/EmployeeRepository";

interface props { employeeRepository: EmployeeRepository }
export default class UpdateEmployeeUseCase {
    _employeeRepository: EmployeeRepository;

    constructor(_: props) {
        this._employeeRepository = _.employeeRepository;
    }

    public call = async (employee: EmployeeEntity) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._employeeRepository.update(employee);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}