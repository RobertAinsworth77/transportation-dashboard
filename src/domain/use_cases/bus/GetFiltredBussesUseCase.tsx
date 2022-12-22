import BusEntity from "../../entities/BusEntity";
import BusRepository from "../../repositories/BusRepository";

interface props { busRepository: BusRepository }
export interface response {
    total_pages: number,
    current_page: number,
    total_rows: number,
    busses: BusEntity[]
}
export default class GetFiltredBussesUseCase {
    _busRepository: BusRepository;

    constructor(_: props) {
        this._busRepository = _.busRepository;
    }

    public call = async (word: string, page: number, itemsPerPage: number) => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._busRepository.getFiltred(word, page, itemsPerPage);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}