import EmployeeEntity from "../../../domain/entities/EmployeeEntity";

const toJson = (employee: EmployeeEntity): any => {
    return {
        id: employee.id,
        name: employee.name,
        phone_number: employee.phone,
        email: employee.email,
        country: employee.country,
        status: employee.enabled ? 'able' : 'disable',
    }
}

const fromJson = (json: any): EmployeeEntity => {
    return {
        id: json.driver_id,
        name: json.name,
        phone: json.phone_number,
        email: json.email,
        country: json.country,
        enabled: json.status == 'able'
    }
}

const EmployeeHostDto = {
    toJson,
    fromJson,
}

export default EmployeeHostDto;