import BusEntity from "../../../domain/entities/BusEntity"

const toJson = (vehicle: BusEntity): any => {
    return {
        vehicle_id: vehicle.id ?? undefined,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        company: vehicle.company,
        vehicle_type: vehicle.vehicleType,
        year: vehicle.year,
        model: vehicle.model,
        make: vehicle.brand,
    }
}

const fromJson = (json: any): BusEntity => {
    return {
        id: json.vehicle_id,
        plate: json.licence_plate_number,
        capacity: json.capacity,
        company: json.company ?? '',
        vehicleType: json.vehcile_type ?? '',
        year: json.year_vehicle ?? 0,
        model: json.vehicle_model ?? '',
        brand: json.vehicle_make ?? '',
}
}

const VehicleHostDto = {
    toJson,
    fromJson,
}

export default VehicleHostDto;