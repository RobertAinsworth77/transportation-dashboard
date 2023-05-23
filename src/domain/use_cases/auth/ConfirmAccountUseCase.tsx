import AuthRepository from "../../repositories/AuthRepository";

interface props { authRepository: AuthRepository }
export default class ConfirmAccountUseCase {
    _authRepository: AuthRepository;

    constructor(_: props) {
        this._authRepository = _.authRepository;
    }

    public call = async (email: string, code: string) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._authRepository.confirmUser(email, code);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}