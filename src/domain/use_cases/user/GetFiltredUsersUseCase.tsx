import UserEntity from "../../entities/UserEntity";
import UserRepository from "../../repositories/UserRepository";

interface props { userRepository: UserRepository }
export interface response {
    total_pages: number,
    current_page: number,
    total_rows: number,
    users: UserEntity[]
}
export default class GetFiltredUsersUseCase {
    _userRepository: UserRepository;

    constructor(_: props) {
        this._userRepository = _.userRepository;
    }

    public call = async (word: string, page: number, itemsPerPage: number) => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._userRepository.getFiltred(word, page, itemsPerPage);
            console.log('response getfilredusersusecase', response);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}