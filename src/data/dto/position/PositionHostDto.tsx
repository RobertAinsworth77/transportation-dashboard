import PositionEntity from "../../../domain/entities/PositionEntity";

const toJson = (position: PositionEntity): any => {
    return {
        lat: position.lat,
        lng: position.lng,
    }
}

const fromJson = (value: string): PositionEntity => {
    return {
        lat: Number(value.split(',')[0]),
        lng: Number(value.split(',')[1]),
    }
}

const PositionHostDto = {
    toJson,
    fromJson,
}

export default PositionHostDto;