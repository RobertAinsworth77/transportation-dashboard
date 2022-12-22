import TripEntity from "../../entities/TripEntity";
import TripRepository from "../../repositories/TripRepository";

interface props { tripRepository: TripRepository }
export interface response {
    total_pages: number,
    current_page: number,
    total_rows: number,
    trips: TripEntity[]
}
export default class GetFiltredTripsUseCase {
    _tripRepository: TripRepository;

    constructor(_: props) {
        this._tripRepository = _.tripRepository;
    }

    public call = async (word: string, page: number, itemsPerPage: number) => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._tripRepository.getFiltred(word, page, itemsPerPage);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}