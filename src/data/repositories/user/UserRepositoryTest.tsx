import UserEntity, { UserEntityRole, UserEntityStatus } from "../../../domain/entities/UserEntity";
import UserRepository, { GetFiltredResponse } from "../../../domain/repositories/UserRepository";

const UserRepositoryTest: UserRepository = {
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
    getFiltred: (word: string, page: number, itemsPerPage: number): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>((resolve, reject) => {
        resolve({
            total_pages: 20,
            current_page: 10,
            total_rows: 3,
            users: [
                {
                    id: 1,
                    name: 'name',
                    phone: 'phone',
                    email: 'email',
                    enabled: true,
                    role: UserEntityRole.admin,
                    status: UserEntityStatus.active
                },
                {
                    id: 2,
                    name: 'name2',
                    phone: 'phone',
                    email: 'email',
                    enabled: true,
                    role: UserEntityRole.admin,
                    status: UserEntityStatus.active
                },
                {
                    id: 3,
                    name: 'name3',
                    phone: 'phone',
                    email: 'email',
                    enabled: true,
                    role: UserEntityRole.admin,
                    status: UserEntityStatus.active
                }
            ]
        });
    }),
    delete: (id: number): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    update: (user: UserEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    create: (user: UserEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    })
}

export default UserRepositoryTest;