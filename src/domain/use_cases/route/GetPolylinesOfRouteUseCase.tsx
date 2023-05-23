import PositionEntity from "../../entities/PositionEntity";
import RouteEntity from "../../entities/RouteEntity";
import TripEntity from "../../entities/TripEntity";
import RouteRepository from "../../repositories/RouteRepository";

interface props { routeRepository: RouteRepository }
export default class GetPolylinesOfRouteUseCase {
    _routeRepository: RouteRepository;

    constructor(_: props) {
        this._routeRepository = _.routeRepository;
    }

    public call = async (id: number, startPoint: PositionEntity, endPoint: PositionEntity) => new Promise<PositionEntity[]>(async (resolve, reject) => {
        console.log('call to get polylines use case');
        try {
            let response: PositionEntity[] = [];
            console.log('call to get polylines use case a', response);
            response = await this._routeRepository.getPolylinesOfRouteLocal(id);
            console.log('call to get polylines use case b', response);
            if (response.length <= 0)
                response = await this._routeRepository.getPolylinesOfRoute(id);
                console.log('call to get polylines use case c', response);
                if (response.length <= 0 ||
                response[0].toString() != startPoint.toString() ||
                response[response.length - 1].toString() != endPoint.toString()) {
                response = await this._routeRepository.getPolylinesFromMaps(startPoint, endPoint);
                console.log('call to get polylines use case c', response);
            }
            if (response.length > 0) {
                this._routeRepository.savePolylinesOfRoute(id, response);
                console.log('call to get polylines use case d', response);
            }
            resolve(response);
        } catch (_) {
            return reject();
        }
    });
}