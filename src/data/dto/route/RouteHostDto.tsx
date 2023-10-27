import RouteEntity from "../../../domain/entities/RouteEntity";
import PositionHostDto from "../position/PositionHostDto";
import SiteHostDto from "../site/SiteHostDto";

const toJson = (route: RouteEntity): any => {
    return {
        route_id: route.id,
        route_name: route.name,
        route_description: route.description,
        start_point: route.start_point != null ? `${route.start_point.lat}, ${route.start_point.lng}` : undefined,
        end_point: route.end_point != null ? `${route.end_point.lat}, ${route.end_point.lng}` : undefined,
        site_id: route.site?.id ?? route.site_id,
        polylines: route.polylines?.map((point => PositionHostDto.toJson(point))) ?? [],
    }
}

const fromJson = (json: any): RouteEntity => {
    return {
        id: json.route_id,
        name: json.route_name,
        description: json.route_description,
        enabled: json.enabled ?? false,
        start_point: json.start_point != null ? PositionHostDto.fromJson(json.start_point) : {lat: 0, lng: 0},
        end_point: json.end_point_point != null ? PositionHostDto.fromJson(json.end_point_point) : {lat: 0, lng: 0},
        site: json.site != null ? SiteHostDto.fromJson(json.site) : undefined,
        site_id: json.site_id,
        polylines: json.polylines ?? []
    }
}

const toDBColumName = (keyName: string | undefined): string => {
    switch (keyName) {
        case 'name':
            return 'route_name';
        case 'description':
            return 'route_description';
        case 'enabled':
            return 'enabled';
        case 'start_point':
            return 'start_point';
        case 'end_point':
            return 'end_point_point';
        case 'site':
            return 'site_id';
        default:
            return 'route_id';
    }
}

const fromDBColumName = (keyName: string | undefined): string => {
    switch (keyName) {
        case 'route_name':
            return 'name';
        case 'route_description':
            return 'description';
        case 'enabled':
            return 'enabled';
        case 'start_point':
            return 'start_point';
        case 'end_point_point':
            return 'end_point';
        case 'site_id':
            return 'site';
        case 'route_id':
            return 'id';
        default:
            return 'id';
    }
}

const RouteHostDto = {
    toJson,
    fromJson,
    toDBColumName,
    fromDBColumName,
}

export default RouteHostDto;