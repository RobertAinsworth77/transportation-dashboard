import { OrdeByFilterEntity } from "../../../domain/entities/OrdeByFilterEntity";

const fromJson = (json: any, fromDBColumnName: (keyName: string | undefined) => string): OrdeByFilterEntity | undefined => {
    if (json == undefined) return undefined;
    return {
        keyName: fromDBColumnName(json.order_by_key_name),
        isDesc: json.order_by_is_desc
    }
}

const toJson = (entity: OrdeByFilterEntity | undefined, toDBColumName: (keyName: string | undefined) => string): any => {
    return {
        "order_by_key_name": toDBColumName(entity?.keyName),
        "order_by_is_desc": entity?.isDesc
    }
}

export default {
    fromJson,
    toJson,
}