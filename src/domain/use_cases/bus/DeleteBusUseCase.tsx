import BusEntity from "../../entities/BusEntity";
import BusRepository from "../../repositories/BusRepository";

interface props { busRepository: BusRepository }
export default class DeleteBusUseCase {
    _busRepository: BusRepository;

    constructor(_: props) {
        this._busRepository = _.busRepository;
    }

    public call = async (id: number) => new Promise<void>(async (resolve, reject) => {
        try {
            await this._busRepository.delete(id);
            return resolve();
        } catch (_) {
            return reject();
        }
    });
}