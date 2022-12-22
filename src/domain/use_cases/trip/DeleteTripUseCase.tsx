import TripRepository from "../../repositories/TripRepository";

interface props { tripRepository: TripRepository }
export default class DeleteTripUseCase {
    _tripRepository: TripRepository;

    constructor(_: props) {
        this._tripRepository = _.tripRepository;
    }

    public call = async (id: number) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._tripRepository.delete(id);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}