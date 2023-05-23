import RouteEntity from "../../entities/RouteEntity";
import RouteRepository from "../../repositories/RouteRepository";

interface props { routeRepository: RouteRepository }
export default class GetRouteByIdUseCase {
    _routeRepository: RouteRepository;

    constructor(_: props) {
        this._routeRepository = _.routeRepository;
    }

    public call = async (id: number) => new Promise<RouteEntity>(async (resolve, reject) => {
        try {
            console.log('get route by id use case calll', id);
            const response = await this._routeRepository.getById(id);
            console.log('get route by id use case', response);
            if (response?.polylines != null) await this._routeRepository.savePolylinesOfRoute(id, response.polylines);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}