import EmployeeEntity, { EmployeePassengerStatus } from "../../../domain/entities/EmployeeEntity";

const toJson = (employee: EmployeeEntity): any => {
    return {
        id: employee.id,
        name: employee.name,
        phone_number: employee.phone,
        email: employee.email,
        country: employee.country,
        status: employee.enabled ? 'able' : 'disable',
        status_booking: employee.passengerStatus == undefined ? undefined :
            employee.passengerStatus == EmployeePassengerStatus.COMPLETED ? 'completed' :
                employee.passengerStatus == EmployeePassengerStatus.PENDING ? 'pending' :
                    employee.passengerStatus == EmployeePassengerStatus.CANCELED ? 'canceled' : undefined,

    }
}

const fromJson = (json: any): EmployeeEntity => {
    return {
<<<<<<< HEAD
        id: json.employee_id,
=======
        id: json.employee_id ?? json.hrm_id,
>>>>>>> test
        name: json.name,
        phone: json.phone_number ?? 'phone_number',
        email: json.email ?? '',
        country: json.country,
        enabled: json.status == 'able',
        passengerStatus: json.status_booking == null ? undefined :
            json.status_booking == 'completed' ? EmployeePassengerStatus.COMPLETED :
                json.status_booking == 'pending' ? EmployeePassengerStatus.PENDING :
                    json.passenger.status == 'canceled' ? EmployeePassengerStatus.CANCELED : undefined,
    }
}

const EmployeeHostDto = {
    toJson,
    fromJson,
}

export default EmployeeHostDto;