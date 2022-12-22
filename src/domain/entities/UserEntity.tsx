import UserAccountEntity from "./UserAccountEntity";

enum UserEntityRole { admin = 'admin', normal = 'normal' }
export default interface UserEntity extends UserAccountEntity {
    role: UserEntityRole
}