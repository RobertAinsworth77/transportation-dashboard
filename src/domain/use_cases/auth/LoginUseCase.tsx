import UserEntity, { UserEntityStatus } from "../../entities/UserEntity";
import UserProvider from "../../providers/user/UserProvider";
import AuthRepository from "../../repositories/AuthRepository";

interface props { authRepository: AuthRepository, userProvider: UserProvider }
export default class LoginUseCase {
    _authRepository: AuthRepository;
    _userProvider: UserProvider;

    constructor(props: props) {
        this._authRepository = props.authRepository;
        this._userProvider = props.userProvider;
    }

    public call = async (user: string, password: string) => new Promise<UserEntity>(async (resolve, reject) => {
        try {
            const response = await this._authRepository.signIn(user, password);
            if (response?.status == UserEntityStatus.deleted) {
                await this._authRepository.deleteUser();
                return reject();
            } else {
                this._userProvider.contextType?.setUser(response);
                return resolve(response);
            }
        } catch (error: any) {
            if (error.name == 'UserNotConfirmedException') {
                this._authRepository.sendConfirmCode(user);
            }
            return reject(error);
        }
    });
}