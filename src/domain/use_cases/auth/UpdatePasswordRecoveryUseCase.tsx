import AuthRepository from "../../repositories/AuthRepository";

interface props { authRepository: AuthRepository }
export default class UpdatePasswordRecoveryUseCase {
    _authRepository: AuthRepository;

    constructor(_:props) {
        this._authRepository = _.authRepository;
    }

    public call = async (email: string, password: string, code: string) => new Promise<void>(async (resolve, reject) => {
        try {
            const as = await this._authRepository.updatePasswordByRecovery(email, password, code);
            resolve();
        } catch (_) {
            reject(_);
        }
    });
}