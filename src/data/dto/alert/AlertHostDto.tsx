import AlertEntity from "../../../domain/entities/AlertEntity"
import DateParse from "../../../ui/utils/DateParse"

const fromJson = (json: any): AlertEntity => {
    return {
        name: json.name_as_key,
        id: json.emrgency_register_id,
        created_at: DateParse.stringToDate(json.date),
        position: {
            lat: json.latitude,
            lng: json.longitude
        },
        tripId: 1,
    }
}

const AlertHostDto = {
    fromJson,
}

export default AlertHostDto;