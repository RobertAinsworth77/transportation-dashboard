import UserEntity from "../../entities/UserEntity";
import UserProvider from "../../provider/user/UserProvider";
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
        const response = await this._authRepository.getCurrentUser();
        if (response) {
            this._userProvider.actions?.setUser(response);
            return resolve(response);
        }
        else return reject();
    });
}