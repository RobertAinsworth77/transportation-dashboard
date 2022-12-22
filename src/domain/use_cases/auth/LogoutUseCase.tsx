import UserEntity from "../../entities/UserEntity";
import UserProvider from "../../provider/user/UserProvider";
import AuthRepository from "../../repositories/AuthRepository";

interface props { authRepository: AuthRepository, userProvider: UserProvider }
export default class LoginUseCase {
    _authRepository: AuthRepository;
    _userProvider: UserProvider;

    constructor(_:props) {
        this._authRepository = _.authRepository;
        this._userProvider = _.userProvider;
    }

    public call = async () => new Promise<void>(async (resolve, reject) => {
        const response = await this._authRepository.signOut();
        this._userProvider.actions?.setUser(undefined);
        return resolve();
    });
}