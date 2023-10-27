import UserAccountEntity from "./UserAccountEntity";

export enum UserEntityRole {
    admin = 'admin',
    normal = 'normal'
}
export enum UserEntityStatus { active = 'active', deleted = 'deleted' }
export default interface UserEntity extends UserAccountEntity {
    role: UserEntityRole,
    status: UserEntityStatus,
}