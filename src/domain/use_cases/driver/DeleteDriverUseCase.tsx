import DriverRepository from "../../repositories/DriverRepository";

interface props { driverRepository: DriverRepository }
export default class DeleteDriverUseCase {
    _driverRepository: DriverRepository;

    constructor(_: props) {
        this._driverRepository = _.driverRepository;
    }

    public call = async (id: number) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._driverRepository.delete(id);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}