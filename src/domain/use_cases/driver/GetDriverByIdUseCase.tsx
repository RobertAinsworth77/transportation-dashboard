import DriverEntity from "../../entities/DriverEntity";
import DriverRepository from "../../repositories/DriverRepository";

interface props { driverRepository: DriverRepository }
export default class GetDriverByIdUseCase {
    _driverRepository: DriverRepository;

    constructor(_: props) {
        this._driverRepository = _.driverRepository;
    }

    public call = async (id: number) => new Promise<DriverEntity>(async (resolve, reject) => {
        try {
            const response = await this._driverRepository.getById(id);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}