import BusEntity from "../../entities/BusEntity";
import BusRepository from "../../repositories/BusRepository";

interface props { busRepository: BusRepository }
export default class CreateBusUseCase {
    _busRepository: BusRepository;

    constructor(_: props) {
        this._busRepository = _.busRepository;
    }

    public call = async (bus: BusEntity) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._busRepository.update(bus);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}