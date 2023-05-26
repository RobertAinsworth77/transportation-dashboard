import UserAccountEntity from "../entities/UserAccountEntity";
import UserEntity from "../entities/UserEntity";

export default interface AuthRepository {
    signIn: (email: string, password: string) => Promise<UserEntity>;
    signOut: () => Promise<void>;
    sendRecoveryCode: (email: string) => Promise<void>
    sendConfirmCode: (email: string) => Promise<void>
    confirmUser: (email: string, code: string) => Promise<void>
    updatePasswordByRecovery: (email: string, newPassword: string, code: string) => Promise<void>
    getCurrentUser: () => Promise<UserEntity>
    addUser: (user: UserAccountEntity, password: string) => Promise<void>
    deleteUser: () => Promise<void>
    refreshToken: () => Promise<void>
}