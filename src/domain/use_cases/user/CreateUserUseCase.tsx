import UserEntity from "../../entities/UserEntity";
import KeyWordLocalization from "../../providers/language/dictionaries/KeyWordLocalization";
import AuthRepository from "../../repositories/AuthRepository";
import UserRepository from "../../repositories/UserRepository";

interface props { userRepository: UserRepository, authRepository: AuthRepository }
export default class CreateUserUseCase {
    _userRepository: UserRepository;
    _authRepository: AuthRepository;

    constructor(_: props) {
        this._userRepository = _.userRepository;
        this._authRepository = _.authRepository;
    }

    public call = async (user: UserEntity, password: string) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._authRepository.addUser(user, password);
        } catch (error: any) {
            if (error.code == 'LimitExceededException') return reject(error.code);
            else if (error.code != 'UsernameExistsException') return reject(KeyWordLocalization.UnknownError);
        }

        try {
            await this._userRepository.create(user)
            return resolve();
        } catch (_) {
            return reject(KeyWordLocalization.UnknownError);
        }
    });
}