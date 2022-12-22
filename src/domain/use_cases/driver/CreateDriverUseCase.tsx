import DriverEntity from "../../entities/DriverEntity";
import DriverRepository from "../../repositories/DriverRepository";

interface props { driverRepository: DriverRepository }
export default class CreateDriverUseCase {
    _driverRepository: DriverRepository;

    constructor(_: props) {
        this._driverRepository = _.driverRepository;
    }

    public call = async (driver: DriverEntity) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._driverRepository.update(driver);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}