import TripEntity from "../../entities/TripEntity";
import TripRepository from "../../repositories/TripRepository";

interface props { tripRepository: TripRepository }
export default class UpdateTripUseCase {
    _tripRepository: TripRepository;

    constructor(_: props) {
        this._tripRepository = _.tripRepository;
    }

    public call = async (trip: TripEntity) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._tripRepository.update(trip);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}