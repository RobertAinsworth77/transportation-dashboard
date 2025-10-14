import { OrdeByFilterEntity } from "../../entities/OrdeByFilterEntity";
import TripEntity from "../../entities/TripEntity";
import TripRepository from "../../repositories/TripRepository";

interface props { tripRepository: TripRepository }
export interface response {
    total_pages: number,
    current_page: number,
    total_rows: number,
    trips: TripEntity[],
    orderBy: OrdeByFilterEntity | undefined,
    statuses?: string[],
    drivers?: string[],
    routes?: string[]
}
export default class GetFiltredTripsUseCase {
    _tripRepository: TripRepository;

    constructor(_: props) {
        this._tripRepository = _.tripRepository;
    }

    public call = async (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined, statusFilter?: string, driverFilter?: string, routeFilter?: string) => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._tripRepository.getFiltred(word, page, itemsPerPage, orderBy, statusFilter, driverFilter, routeFilter);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}