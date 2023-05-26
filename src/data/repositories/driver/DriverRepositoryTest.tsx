import DriverEntity from "../../../domain/entities/DriverEntity";
import DriverRepository, { GetFiltredResponse } from "../../../domain/repositories/DriverRepository";

const DriverRepositoryTest: DriverRepository = {
    getById: (id: number): Promise<DriverEntity> => new Promise<DriverEntity>((resolve, reject) => {
        resolve({
            id: 1,
            name: 'name',
            phone: 'phone',
            email: 'email',
            enabled: true,
            country: 'country',
        });
    }),
    getFiltred: (word: string, page: number, itemsPerPage: number): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>((resolve, reject) => {
        resolve({
            total_pages: 20,
            current_page: 10,
            total_rows: 3,
            drivers: [
                {
                    id: 1,
                    name: 'name',
                    phone: 'phone',
                    email: 'email',
                    enabled: true,
                    country: 'country',
                    defaultBus: {
                        id: 1,
                        plate: 'plate',
                        capacity: 10,
                        company: 'company',
                        vehicleType: 'vehicleType',
                        year: 2022,
                        model: 'Coaster',
                        brand: 'BMS',
                    }
                },
                {
                    id: 2,
                    name: 'name2',
                    phone: 'phone',
                    email: 'email',
                    enabled: true,
                    country: 'country',
                },
                {
                    id: 3,
                    name: 'name3',
                    phone: 'phone',
                    email: 'email',
                    enabled: true,
                    country: 'country',
                }
            ]
        });
    }),
    searchByWord: (word: string): Promise<DriverEntity[]> => new Promise<DriverEntity[]>((resolve, reject) => {
        resolve([
            {
                id: 1,
                name: 'name',
                phone: 'phone',
                email: 'email',
                enabled: true,
                country: 'country',
                defaultBus: {
                    id: 1,
                    plate: 'plate',
                    capacity: 10,
                    company: 'company',
                    vehicleType: 'vehicleType',
                    year: 2022,
                    model: 'Coaster',
                    brand: 'BMS',
            }
            },
            {
                id: 2,
                name: 'name2',
                phone: 'phone',
                email: 'email',
                enabled: true,
                country: 'country',
                defaultBus: {
                    id: 2,
                    plate: 'plate2',
                    capacity: 10,
                    company: 'company',
                    vehicleType: 'vehicleType',
                    year: 2022,
                    model: 'Coaster',
                    brand: 'BMS',
            }
            },
            {
                id: 3,
                name: 'name3',
                phone: 'phone',
                email: 'email',
                enabled: true,
                country: 'country',
                defaultBus: {
                    id: 3,
                    company: 'company',
                    vehicleType: 'vehicleType',
                    year: 2022,
                    model: 'Coaster',
                    brand: 'BMS',
                    plate: 'plate3',
                    capacity: 10,
                }
            }
        ]);
    }),
    delete: (id: number): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    update: (driver: DriverEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    create: (driver: DriverEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    })
}

export default DriverRepositoryTest;