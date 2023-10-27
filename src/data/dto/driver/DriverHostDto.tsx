import DriverEntity from "../../../domain/entities/DriverEntity";

const toJson = (driver: DriverEntity): any => {
    return {
        id: driver.id,
        name: driver.name,
        last_name: driver.last_name,
        cell_phone: driver.phone,
        email: driver.email,
        country: driver.country,
        default_bus_id: driver.defaultBus?.id,
        status: driver.enabled ? 'able': 'disable',
    }
}

const fromJson = (json: any): DriverEntity => {
    return {
        id: json.driver_id,
        name: json.driver_name || json.name,
        last_name: json.last_name ?? '',
        phone: json.cell_phone ?? '',
        email: json.email ?? '',
        country: json.country ?? '',
        defaultBus: json.default_bus_id ?? '',
        enabled: json.status == 'able' ?? '',
    }
}

const toDBColumName = (keyName: string | undefined): string => {
    switch (keyName) {
        case 'name':
            return 'name';
        case 'last_name':
            return 'last_name';
        case 'phone':
            return 'cell_phone';
        case 'email':
            return 'email';
        case 'country':
            return 'country';
        case 'defaultBus':
            return 'default_bus_id';
        case 'enabled':
            return 'status';
        case 'id':
            return 'driver_id';
        default:
            return 'driver_id';
    }
}

const fromDBColumName = (keyName: string | undefined): string => {
    switch (keyName) {
        case 'name':
            return 'name';
        case 'last_name':
            return 'last_name';
        case 'cell_phone':
            return 'phone';
        case 'email':
            return 'email';
        case 'country':
            return 'country';
        case 'default_bus_id':
            return 'defaultBus';
        case 'status':
            return 'enabled';
        case 'driver_id':
            return 'id';
        default:
            return 'id';
    }
}

const DriverHostDto = {
    toJson,
    fromJson,
    toDBColumName,
    fromDBColumName,
}

export default DriverHostDto;