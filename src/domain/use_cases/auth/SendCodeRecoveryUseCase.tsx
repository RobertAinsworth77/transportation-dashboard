import AuthRepository from "../../repositories/AuthRepository";

interface props { authRepository: AuthRepository }
export default class SendCodeRecoveryUseCase {
    _authRepository: AuthRepository;

    constructor(_: props) {
        this._authRepository = _.authRepository;
    }

    public call = async (email: string) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._authRepository.sendRecoveryCode(email);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}