import UserRepository from "../../repositories/UserRepository";

interface props { userRepository: UserRepository }
export default class DeleteUserUseCase {
    _userRepository: UserRepository;

    constructor(_: props) {
        this._userRepository = _.userRepository;
    }

    public call = async (id: number) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._userRepository.delete(id);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}