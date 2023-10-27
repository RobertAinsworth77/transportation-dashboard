import { OrdeByFilterEntity } from "../../entities/OrdeByFilterEntity";
import UserEntity from "../../entities/UserEntity";
import UserRepository from "../../repositories/UserRepository";

interface props { userRepository: UserRepository }
export interface response {
    total_pages: number,
    current_page: number,
    total_rows: number,
    users: UserEntity[],
    orderBy: OrdeByFilterEntity | undefined,
}
export default class GetFiltredUsersUseCase {
    _userRepository: UserRepository;

    constructor(_: props) {
        this._userRepository = _.userRepository;
    }

    public call = async (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined) => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._userRepository.getFiltred(word, page, itemsPerPage, orderBy);
            console.log('response getfilredusersusecase', response);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}