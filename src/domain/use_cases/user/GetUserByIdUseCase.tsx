import UserEntity from "../../entities/UserEntity";
import UserRepository from "../../repositories/UserRepository";

interface props { userRepository: UserRepository }
export default class GetUserByIdUseCase {
    _userRepository: UserRepository;

    constructor(_: props) {
        this._userRepository = _.userRepository;
    }

    public call = async (id: number) => new Promise<UserEntity>(async (resolve, reject) => {
        try {
            const response = await this._userRepository.getById(id);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}