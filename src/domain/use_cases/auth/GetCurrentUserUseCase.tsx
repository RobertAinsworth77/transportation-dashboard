import UserEntity, { UserEntityStatus } from "../../entities/UserEntity";
import UserProvider from "../../providers/user/UserProvider";
import AuthRepository from "../../repositories/AuthRepository";

interface props { authRepository: AuthRepository, userProvider: UserProvider }
export default class GetCurrentUserUseCase {
    _authRepository: AuthRepository;
    _userProvider: UserProvider;

    constructor(props: props) {
        this._authRepository = props.authRepository;
        this._userProvider = props.userProvider;
    }

    public call = async () => new Promise<UserEntity>(async (resolve, reject) => {
        try {
            const response = await this._authRepository.getCurrentUser();
            if (response?.status == UserEntityStatus.deleted) {
                await this._authRepository.deleteUser();
                await this._authRepository.signOut();
                this._userProvider.contextType?.setUser(undefined);
                return reject();
            } else {
                this._userProvider.contextType?.setUser(response);
                return resolve(response);
            }
        } catch (error) {
            console.log('GetCurrentUserUseCase error', error);
            return reject(error);
        }
    });
}