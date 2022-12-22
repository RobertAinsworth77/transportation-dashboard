import DriverEntity from "../../entities/DriverEntity";
import DriverRepository from "../../repositories/DriverRepository";

interface props { driverRepository: DriverRepository }
export interface response {
    total_pages: number,
    current_page: number,
    total_rows: number,
    driverses: DriverEntity[]
}
export default class GetFiltredDriversesUseCase {
    _driverRepository: DriverRepository;

    constructor(_: props) {
        this._driverRepository = _.driverRepository;
    }

    public call = async (word: string, page: number, itemsPerPage: number) => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._driverRepository.getFiltred(word, page, itemsPerPage);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}