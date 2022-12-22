import RouteEntity from "../../entities/RouteEntity";
import RouteRepository from "../../repositories/RouteRepository";

interface props { routeRepository: RouteRepository }
export default class UpdateRouteUseCase {
    _routeRepository: RouteRepository;

    constructor(_: props) {
        this._routeRepository = _.routeRepository;
    }

    public call = async (route: RouteEntity) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._routeRepository.update(route);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}