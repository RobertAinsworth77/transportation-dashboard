import UserEntity from "../../entities/UserEntity";
import UserRepository from "../../repositories/UserRepository";

interface props { userRepository: UserRepository }
export default class UpdateUserUseCase {
    _userRepository: UserRepository;

    constructor(_: props) {
        this._userRepository = _.userRepository;
    }

    public call = async (user: UserEntity) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._userRepository.update(user);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}