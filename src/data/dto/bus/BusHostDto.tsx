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

const toDBColumName = (keyName: string | undefined): string => {
    switch (keyName) {
        case 'plate':
            return 'licence_plate_number';
        case 'capacity':
            return 'capacity';
        case 'company':
            return 'company';
        case 'vehicleType':
            return 'vehcile_type';
        case 'year':
            return 'year_vehicle';
        case 'model':
            return 'vehicle_model';
        case 'brand':
            return 'vehicle_make';
        case 'id':
            return 'vehicle_id';
        default:
            return 'vehicle_id';
    }
}

const fromDBColumName = (keyName: string | undefined): string => {
    switch (keyName) {
        case 'licence_plate_number':
            return 'plate';
        case 'capacity':
            return 'capacity';
        case 'company':
            return 'company';
        case 'vehcile_type':
            return 'vehicleType';
        case 'year_vehicle':
            return 'year';
        case 'vehicle_model':
            return 'model';
        case 'vehicle_make':
            return 'brand';
        case 'vehicle_id':
            return 'id';
        default:
            return 'id';
    }
}

const VehicleHostDto = {
    toJson,
    fromJson,
    toDBColumName,
    fromDBColumName,
}

export default VehicleHostDto;