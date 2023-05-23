import UserEntity, { UserEntityRole, UserEntityStatus } from "../../../domain/entities/UserEntity";

const toJson = (user: UserEntity): any => {
    return {
        id: user.id,
        name: user.name,
        phone_number: user.phone,
        email: user.email,
        role: user.role,
    }
}

const fromJson = (json: any): UserEntity => {
    return {
        id: json.user_id,
        name: json.name,
        phone: json.phone_number,
        email: json.email,
        enabled: json.status == 'able',
        role: json.role ?? UserEntityRole.admin,
        status: json.status ?? UserEntityStatus.active,
    }
}

const UserHostDto = {
    toJson,
    fromJson,
}

export default UserHostDto;