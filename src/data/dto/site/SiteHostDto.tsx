import SiteEntity from "../../../domain/entities/SiteEntity";

const toJson = (site: SiteEntity): any => {
    return {
        site_id: site.id,
        site_name: site.name,
        country: site.country,
    }
}

const fromJson = (json: any): SiteEntity => {
    return {
        id: json.site_id,
        name: json.site_name,
        country: json.country ?? '',
    }
}

const toDBColumName = (keyName: string | undefined): string => {
    switch (keyName) {
        case 'name':
            return 'site_name';
        case 'country':
            return 'country';
        default:
            return 'site_id';
    }
}

const fromDBColumName = (keyName: string | undefined): string => {
    switch (keyName) {
        case 'site_name':
            return 'name';
        case 'country':
            return 'country';
        default:
            return 'id';
    }
}


const SiteHostDto = {
    toJson,
    fromJson,
    toDBColumName,
    fromDBColumName,
}

export default SiteHostDto;