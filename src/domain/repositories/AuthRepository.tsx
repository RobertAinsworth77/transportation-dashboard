import AlertEntity from "../entities/SiteEntity";
import UserEntity from "../entities/UserEntity";

export default interface AlertRepository {
    signIn: (email: string, password: string) => Promise<UserEntity>;
    signOut: () => Promise<void>;
    sendRecoveryCode: (email: string) => Promise<void>
    updatePasswordByRecovery: (email: string, newPassword: string, code: string) => Promise<void>
    getCurrentUser: () => Promise<UserEntity>
}