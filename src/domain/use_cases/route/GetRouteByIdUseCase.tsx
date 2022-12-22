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
            const response = await this._routeRepository.getById(id);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}