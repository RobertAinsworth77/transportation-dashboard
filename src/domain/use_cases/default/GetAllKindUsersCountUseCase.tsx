import AlertEntity from "../../entities/AlertEntity";
import AlertProvider from "../../provider/alert/AlertProvider";
import AlertRepository from "../../repositories/AlertRepository";
import DefaultRepository from "../../repositories/DefaultRepository";

interface props { defaultRepository: DefaultRepository }
export interface response {
    busses_count: number,
    trips_count: number,
    routes_count: number,
}
export default class GetAllKindUsersCountUseCase {
    _defaultRepository: DefaultRepository;

    constructor(_: props) {
        this._defaultRepository = _.defaultRepository;
    }

    public call = async () => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._defaultRepository.getAllKindUsersCount();
            return resolve(response);
        } catch (error) {
            return reject();
        }
    });
}