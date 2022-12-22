import RouteEntity from "../../entities/RouteEntity";
import RouteRepository from "../../repositories/RouteRepository";

interface props { routeRepository: RouteRepository }
export default class SearchRoutesByNameUseCase {
    _routeRepository: RouteRepository;

    constructor(_: props) {
        this._routeRepository = _.routeRepository;
    }

    public call = async (word: string) => new Promise<RouteEntity[]>(async (resolve, reject) => {
        try {
            const response = await this._routeRepository.searchByWord(word);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}