import PositionEntity from "../../entities/PositionEntity";
import RouteEntity from "../../entities/RouteEntity";
import TripEntity from "../../entities/TripEntity";
import RouteRepository from "../../repositories/RouteRepository";

interface props { routeRepository: RouteRepository }
export default class GetPolylinesOfTwoPointnsUseCase {
    _routeRepository: RouteRepository;

    constructor(_: props) {
        this._routeRepository = _.routeRepository;
    }

    public call = async (startPoint: PositionEntity, endPoint: PositionEntity) => new Promise<PositionEntity[]>(async (resolve, reject) => {
        try {
            let response: PositionEntity[] =  await this._routeRepository.getPolylinesFromMaps(startPoint, endPoint);
            
            resolve(response);
        } catch (_) {
            return reject();
        }
    });
}