import EmployeeEntity from "../../entities/EmployeeEntity";
import EmployeeRepository from "../../repositories/EmployeeRepository";

interface props { employeeRepository: EmployeeRepository }
export default class GetEmployeeByEmailUseCase {
    _employeeRepository: EmployeeRepository;

    constructor(_: props) {
        this._employeeRepository = _.employeeRepository;
    }

    public call = async (email: string) => new Promise<EmployeeEntity | null>(async (resolve, reject) => {
        try {
            const response = await this._employeeRepository.getByEmail(email);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}