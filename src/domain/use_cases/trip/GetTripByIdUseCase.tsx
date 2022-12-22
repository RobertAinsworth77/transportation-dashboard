import TripEntity from "../../entities/TripEntity";
import TripRepository from "../../repositories/TripRepository";

interface props { tripRepository: TripRepository }
export default class GetTripByIdUseCase {
    _tripRepository: TripRepository;

    constructor(_: props) {
        this._tripRepository = _.tripRepository;
    }

    public call = async (id: number) => new Promise<TripEntity>(async (resolve, reject) => {
        try {
            const response = await this._tripRepository.getById(id);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}