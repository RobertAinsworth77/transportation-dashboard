import BusEntity from "../../../domain/entities/BusEntity";
import BusRepository, { GetFiltredResponse } from "../../../domain/repositories/BusRepository";
import BusHostDto from "../../dto/bus/BusHostDto";
import HostApi from "../../settings/host/HostApi";

const BusRepositoryImpl: BusRepository = {
    getById: (id: number): Promise<BusEntity> => new Promise<BusEntity>(async (resolve, reject) => {
        const response = await HostApi.get(`/dashboard/busses?id=${id}`);
        const busMapped = BusHostDto.fromJson(response.data);
        return resolve(busMapped);
    }),
    getFiltred: (word: string, page: number, itemsPerPage: number): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>(async (resolve, reject) => {
        const body = {
            "items_per_page": itemsPerPage,
            "page": page,
            "search_word": word
        }
        try {
            const response = await HostApi.post('/dashboard/busses/search', body);
            console.log('busses getted', response);
            const bussesMapped = response.data.map((bus: any) => BusHostDto.fromJson(bus));
            const responseMapped = {
                total_pages: response.total_pages,
                current_page: page,
                total_rows: response.total_rows,
                busses: bussesMapped
            }
            return resolve(responseMapped);
        } catch (error) {
            reject(error);
        }
    }),
    searchByWord: (word: string): Promise<BusEntity[]> => new Promise<BusEntity[]>(async (resolve, reject) => {
        const body = {
            "items_per_page": 10,
            "page": 1,
            "search_word": word
        }
        try {
            const response = await HostApi.post('/dashboard/busses/search', body);
            const bussesMapped = response.data.map((bus: any) => BusHostDto.fromJson(bus));
            return resolve(bussesMapped);
        } catch (error) {
            reject(error);
        }
    }),
    delete: (id: number): Promise<void> => new Promise<void>(async (resolve, reject) => {
        try {
            await HostApi.remove(`/dashboard/busses?id=${id}`);
            resolve();
        } catch (error) {
            reject(error);
        }
    }),
    update: (driver: BusEntity): Promise<void> => new Promise<void>( async (resolve, reject) => {
        const body = BusHostDto.toJson(driver);
        try {
            await HostApi.put(`/dashboard/busses?id=${driver.id}`, body);
            resolve();
        } catch (error) {
            reject(error);
        }
    }),
    create: (driver: BusEntity): Promise<void> => new Promise<void>(async (resolve, reject) => {
        const body = BusHostDto.toJson(driver);
        try {
            await HostApi.post('/dashboard/busses', body);
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export default BusRepositoryImpl;