import { OrdeByFilterEntity } from "../../entities/OrdeByFilterEntity";
import RouteEntity from "../../entities/RouteEntity";
import RouteRepository from "../../repositories/RouteRepository";

interface props { routeRepository: RouteRepository }
export interface response {
    total_pages: number,
    current_page: number,
    total_rows: number,
    routes: RouteEntity[],
    orderBy: OrdeByFilterEntity | undefined,
}
export default class GetFiltredRoutesUseCase {
    _routeRepository: RouteRepository;

    constructor(_: props) {
        this._routeRepository = _.routeRepository;
    }

    public call = async (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined) => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._routeRepository.getFiltred(word, page, itemsPerPage, orderBy);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}