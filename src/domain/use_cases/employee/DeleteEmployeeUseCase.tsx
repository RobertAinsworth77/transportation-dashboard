import EmployeeRepository from "../../repositories/EmployeeRepository";

interface props { employeeRepository: EmployeeRepository }
export default class DeleteEmployeeUseCase {
    _employeeRepository: EmployeeRepository;

    constructor(_: props) {
        this._employeeRepository = _.employeeRepository;
    }

    public call = async (id: number) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._employeeRepository.delete(id);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}