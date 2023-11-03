
import UserEntity, { UserEntityRole, UserEntityStatus } from "../../../domain/entities/UserEntity";

const toJson = (user: UserEntity): any => {
    return {
        id: user.id,
        name: user.name,
        last_name: user.lastname,
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
        lastname: json.last_name,
        email: json.email,
        enabled: json.status == 'able',
        role: json.role ?? UserEntityRole.admin,
        status: json.status ?? UserEntityStatus.active,
    }
}

const toDBColumName = (keyName: string | undefined): string => {
    switch (keyName) {
        case 'name':
            return 'name';
        case 'phone':
            return 'phone_number';
        case 'email':
            return 'email';
        case 'role':
            return 'role';
        case 'status':
            return 'status';
        case 'id':
            return 'user_id';
        default:
            return 'user_id';
    }
}

const fromDBColumName = (keyName: string | undefined): string => {
    switch (keyName) {
        case 'name':
            return 'name';
        case 'phone_number':
            return 'phone';
        case 'email':
            return 'email';
        case 'role':
            return 'role';
        case 'status':
            return 'status';
        case 'user_id':
            return 'id';
        default:
            return 'id';
    }
}

const UserHostDto = {
    toJson,
    fromJson,
    toDBColumName,
    fromDBColumName,
}

export default UserHostDto;