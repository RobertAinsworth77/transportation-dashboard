import DriverEntity from "../../entities/DriverEntity";
import KeyWordLocalization from "../../providers/language/dictionaries/KeyWordLocalization";
import AuthRepository from "../../repositories/AuthRepository";
import DriverRepository from "../../repositories/DriverRepository";

interface props { driverRepository: DriverRepository, authRepository: AuthRepository }
export default class CreateDriverUseCase {
    _driverRepository: DriverRepository;
    _authRepository: AuthRepository;

    constructor(_: props) {
        this._driverRepository = _.driverRepository;
        this._authRepository = _.authRepository;
    }

    public call = async (driver: DriverEntity, password: string) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._authRepository.addUser(driver, password);
        } catch (error: any) {
            if (error.code == 'LimitExceededException') return reject(error.code);
            else if (error.code != 'UsernameExistsException') return reject(KeyWordLocalization.UnknownError);
        }

        try {
            await this._driverRepository.create(driver)
            return resolve();
        } catch (_) {
            return reject(KeyWordLocalization.UnknownError);
        }
    });
}