import DriverEntity from "../../../domain/entities/DriverEntity";
import { OrdeByFilterEntity } from "../../../domain/entities/OrdeByFilterEntity";
import DriverRepository, { GetFiltredResponse } from "../../../domain/repositories/DriverRepository";
import DriverHostDto from "../../dto/driver/DriverHostDto";
import OrderByHostDto from "../../dto/orderByFilter/OrderByHostDto";
import HostApi from "../../settings/host/HostApi";

const DriverRepositoryImpl: DriverRepository = {
    getById: (id: number): Promise<DriverEntity> => new Promise<DriverEntity>((resolve, reject) => {
        //unnecessary
        resolve({
            id: 1,
            name: 'name',
            phone: 'phone',
            email: 'email',
            enabled: true,
            country: 'country',
        });
    }),
    getFiltred: (word: string, page: number, itemsPerPage: number, orderBy: OrdeByFilterEntity | undefined): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>(async (resolve, reject) => {
        const body = {
            "items_per_page": itemsPerPage,
            "page": page,
            "search_word": word,
            ...OrderByHostDto.toJson(orderBy, DriverHostDto.toDBColumName)
        }
        try {
            const response = await HostApi.post('/dashboard/users/drivers', body);
            const driversMapped = response.data.map((driver: any) => DriverHostDto.fromJson(driver));
            const responseMapped = {
                total_pages: response.total_pages,
                current_page: page,
                total_rows: response.total_rows,
                drivers: driversMapped,
                orderBy: OrderByHostDto.fromJson(response.order_by, DriverHostDto.fromDBColumName)
            }
            return resolve(responseMapped);
        } catch (error) {
            reject(error);
        }
    }),
    searchByWord: (word: string): Promise<DriverEntity[]> => new Promise<DriverEntity[]>(async (resolve, reject) => {
        const body = {
            "items_per_page": 20,
            "page": 1,
            "search_word": word
        }
        try {
            const response = await HostApi.post('/dashboard/users/drivers', body);
            const driversMapped = response.data.map((driver: any) => DriverHostDto.fromJson(driver));
            return resolve(driversMapped);
        } catch (error) {
            reject(error);
        }
    }),
    delete: (id: number): Promise<void> => new Promise<void>(async (resolve, reject) => {
        try {
            await HostApi.post('/dashboard/users/drivers/delete', { 'driver_id': id });
            resolve();
        } catch (error) {
            reject(error);
        }
    }),
    update: (driver: DriverEntity): Promise<void> => new Promise<void>(async (resolve, reject) => {
        const body = DriverHostDto.toJson(driver);
        try {
            await HostApi.put(`/dashboard/users/drivers?id=${driver.id}`, body);
            resolve();
        } catch (error) {
            reject(error);
        }
    }),
    create: (driver: DriverEntity): Promise<void> => new Promise<void>(async (resolve, reject) => {
        try {
            const body = {
                ...DriverHostDto.toJson(driver),
            }
            body.phone = "+" + body.phone;
            await HostApi.post('/dashboard/users/drivers/add', body);
            return resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export default DriverRepositoryImpl;