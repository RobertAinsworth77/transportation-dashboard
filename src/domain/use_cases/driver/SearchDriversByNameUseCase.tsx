import DriverEntity from "../../entities/DriverEntity";
import DriverRepository from "../../repositories/DriverRepository";

interface props { driverRepository: DriverRepository }
export default class SearchDriversByNameUseCase {
    _driverRepository: DriverRepository;

    constructor(_: props) {
        this._driverRepository = _.driverRepository;
    }

    public call = async (word: string) => new Promise<DriverEntity[]>(async (resolve, reject) => {
        try {
            const response = await this._driverRepository.searchByWord(word);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}