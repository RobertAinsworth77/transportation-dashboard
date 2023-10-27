import DriverEntity from "../../entities/DriverEntity";
import { OrdeByFilterEntity } from "../../entities/OrdeByFilterEntity";
import DriverRepository from "../../repositories/DriverRepository";

interface props { driverRepository: DriverRepository }
export interface response {
    total_pages: number,
    current_page: number,
    total_rows: number,
    drivers: DriverEntity[],
    orderBy: OrdeByFilterEntity | undefined,
}
export default class GetFiltredDriversUseCase {
    _driverRepository: DriverRepository;

    constructor(_: props) {
        this._driverRepository = _.driverRepository;
    }

    public call = async (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined) => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._driverRepository.getFiltred(word, page, itemsPerPage, orderBy);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}