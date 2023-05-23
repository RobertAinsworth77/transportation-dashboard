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

const DriverHostDto = {
    toJson,
    fromJson,
}

export default DriverHostDto;