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

const SiteHostDto = {
    toJson,
    fromJson,
}

export default SiteHostDto;