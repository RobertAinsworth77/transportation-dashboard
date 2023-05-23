import UserEntity, { UserEntityRole, UserEntityStatus } from "../../../domain/entities/UserEntity";
import UserRepository, { GetFiltredResponse } from "../../../domain/repositories/UserRepository";
import UserHostDto from "../../dto/user/UserHostDto";
import HostApi from "../../settings/host/HostApi";

const UserRepositoryImpl: UserRepository = {
    getById: (id: number): Promise<UserEntity> => new Promise<UserEntity>((resolve, reject) => {
        resolve({
            id: 1,
            name: 'name',
            phone: 'phone',
            email: 'email',
            enabled: true,
            role: UserEntityRole.admin,
            status: UserEntityStatus.active
        });
    }),
    getFiltred: (word: string, page: number, itemsPerPage: number): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>(async (resolve, reject) => {
        const body = {
            "items_per_page": itemsPerPage,
            "page": page,
            "search_word": word
        }
        try {
            const response = await HostApi.post('/dashboard/users/search', body);
            const usersMapped = response.data.map((user: any) => UserHostDto.fromJson(user));
            const responseMapped = {
                total_pages: response.total_pages,
                current_page: page,
                total_rows: response.total_rows,
                users: usersMapped
            }
            return resolve(responseMapped);
        } catch (error) {
            reject(error);
        }
    }),
    delete: (id: number): Promise<void> => new Promise<void>(async (resolve, reject) => {
        try {
            await HostApi.remove(`/dashboard/users/admin?id=${id}`);
            return resolve();
        } catch (error) {
            reject(error);
        }
    }),
    update: (user: UserEntity): Promise<void> => new Promise<void>(async (resolve, reject) => {
        try {
            const body = UserHostDto.toJson(user);
            await HostApi.put(`/dashboard/users/admin?id=${user.id}`, body);
            return resolve();
        } catch (error) {
            reject(error);
        }
    }),
    create: (user: UserEntity): Promise<void> => new Promise<void>(async (resolve, reject) => {
        try {
            const body = UserHostDto.toJson(user);
            body.phone = "+" + body.phone;
            await HostApi.post('/dashboard/users/admin', body);
            return resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export default UserRepositoryImpl;