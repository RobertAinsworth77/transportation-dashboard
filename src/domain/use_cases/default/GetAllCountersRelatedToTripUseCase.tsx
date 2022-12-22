import DefaultRepository from "../../repositories/DefaultRepository";

interface props { defaultRepository: DefaultRepository }
export interface response {
    busses_count: number,
    trips_count: number,
    routes_count: number,
}
export default class GetAllCountersRelatedToTripUseCase {
    _defaultRepository: DefaultRepository;

    constructor(_: props) {
        this._defaultRepository = _.defaultRepository;
    }

    public call = async () => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._defaultRepository.getAllCountersRelatedToTrip();
            return resolve(response);
        } catch (error) {
            return reject();
        }
    });
}