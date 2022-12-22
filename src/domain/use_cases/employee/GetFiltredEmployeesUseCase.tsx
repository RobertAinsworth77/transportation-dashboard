import EmployeeEntity from "../../entities/EmployeeEntity";
import EmployeeRepository from "../../repositories/EmployeeRepository";

interface props { employeeRepository: EmployeeRepository }
export interface response {
    total_pages: number,
    current_page: number,
    total_rows: number,
    employees: EmployeeEntity[]
}
export default class GetFiltredEmployeesUseCase {
    _employeeRepository: EmployeeRepository;

    constructor(_: props) {
        this._employeeRepository = _.employeeRepository;
    }

    public call = async (word: string, page: number, itemsPerPage: number) => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._employeeRepository.getFiltred(word, page, itemsPerPage);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}