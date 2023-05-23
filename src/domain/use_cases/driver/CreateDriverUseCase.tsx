import DriverEntity from "../../entities/DriverEntity";
import DriverRepository from "../../repositories/DriverRepository";

interface props { driverRepository: DriverRepository }
export default class CreateDriverUseCase {
    _driverRepository: DriverRepository;

    constructor(_: props) {
        this._driverRepository = _.driverRepository;
    }

    public call = async (driver: DriverEntity, password: string) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._driverRepository.create(driver, password);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}