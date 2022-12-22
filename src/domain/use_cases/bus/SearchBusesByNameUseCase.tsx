import BusEntity from "../../entities/BusEntity";
import BusRepository from "../../repositories/BusRepository";

interface props { busRepository: BusRepository }
export default class SearchBusesByNameUseCase {
    _busRepository: BusRepository;

    constructor(_: props) {
        this._busRepository = _.busRepository;
    }

    public call = async (word: string) => new Promise<BusEntity[]>(async (resolve, reject) => {
        try {
            const response = await this._busRepository.searchByWord(word);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}