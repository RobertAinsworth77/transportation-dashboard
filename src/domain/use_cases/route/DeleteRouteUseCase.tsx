import RouteRepository from "../../repositories/RouteRepository";

interface props { routeRepository: RouteRepository }
export default class DeleteRouteUseCases {
    _routeRepository: RouteRepository;

    constructor(_: props) {
        this._routeRepository = _.routeRepository;
    }

    public call = async (id: number) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._routeRepository.delete(id);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}