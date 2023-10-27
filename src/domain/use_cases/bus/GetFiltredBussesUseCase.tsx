import BusEntity from "../../entities/BusEntity";
import { OrdeByFilterEntity } from "../../entities/OrdeByFilterEntity";
import BusRepository from "../../repositories/BusRepository";

interface props { busRepository: BusRepository }
export interface response {
    total_pages: number,
    current_page: number,
    total_rows: number,
    busses: BusEntity[],
    orderBy: OrdeByFilterEntity | undefined,
}
export default class GetFiltredBussesUseCase {
    _busRepository: BusRepository;

    constructor(_: props) {
        this._busRepository = _.busRepository;
    }

    public call = async (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined) => new Promise<response>(async (resolve, reject) => {
        try {
            const response = await this._busRepository.getFiltred(word, page, itemsPerPage, orderBy);
            return resolve(response);
        } catch (_) {
            return reject();
        }
    });
}