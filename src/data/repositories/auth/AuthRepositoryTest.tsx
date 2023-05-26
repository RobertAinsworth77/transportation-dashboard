import UserAccountEntity from "../../../domain/entities/UserAccountEntity";
import UserEntity, { UserEntityRole, UserEntityStatus } from "../../../domain/entities/UserEntity";
import AuthRepository from "../../../domain/repositories/AuthRepository";

const AuthRepositoryTest: AuthRepository = {
    signIn: async (email: string, password: string): Promise<UserEntity> => new Promise<UserEntity>((resolve, reject) => {
        resolve({
            id: 1,
            name: 'name',
            phone: 'phone',
            email: email,
            enabled: true,
            role: UserEntityRole.admin,
            status: UserEntityStatus.active,
        });
    }),
    signOut: (): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    confirmUser: (email: string): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    sendRecoveryCode: (email: string): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    sendConfirmCode: (email: string): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    updatePasswordByRecovery: (email: string, newPassword: string, code: string): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    getCurrentUser: (): Promise<UserEntity> => new Promise<UserEntity>((resolve, reject) => {
        resolve({
            id: 1,
            name: 'name',
            phone: 'phone',
            email: 'email',
            enabled: true,
            role: UserEntityRole.admin,
            status: UserEntityStatus.active,
        });
    }),
    addUser: (user: UserAccountEntity, password: string): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    deleteUser: (): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    refreshToken: (): Promise<void> => new Promise<void>((resolve, reject) =>{
        resolve();
    }),
}

export default AuthRepositoryTest;