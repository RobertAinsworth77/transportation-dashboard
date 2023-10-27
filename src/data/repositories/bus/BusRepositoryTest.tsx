import BusEntity from "../../../domain/entities/BusEntity";
import BusRepository, { GetFiltredResponse } from "../../../domain/repositories/BusRepository";

const BusRepositoryTest: BusRepository = {
    getById: (id: number): Promise<BusEntity> => new Promise<BusEntity>((resolve, reject) => {
        resolve({
            id: 1,
            plate: 'MKJ-123',
            capacity: 24,
            company: 'company',
            vehicleType: 'vehicleType',
            year: 2022,
            model: 'Coaster',
            brand: 'BMS',
        });
    }),
    getFiltred: (word: string, page: number, itemsPerPage: number): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>((resolve, reject) => {
        resolve({
            total_pages: 20,
            current_page: 10,
            total_rows: 3,
            orderBy: {
                keyName: 'id',
                isDesc: false,
            },
            busses: [
                {
                    id: 1,
                    plate: 'MKJ-121',
                    capacity: 24,
                    company: 'company',
                    vehicleType: 'vehicleType',
                    year: 2022,
                    model: 'Coaster',
                    brand: 'BMS',
                },
                {
                    id: 2,
                    plate: 'MKJ-122',
                    capacity: 24,
                    company: 'company',
                    vehicleType: 'vehicleType',
                    year: 2022,
                    model: 'Coaster',
                    brand: 'BMS',
                },
                {
                    id: 3,
                    plate: 'MKJ-123',
                    capacity: 24,
                    company: 'company',
                    vehicleType: 'vehicleType',
                    year: 2022,
                    model: 'Coaster',
                    brand: 'BMS',
                },
            ]
        });
    }),
    searchByWord: (word: string): Promise<BusEntity[]> => new Promise<BusEntity[]>((resolve, reject) => {
        resolve([
            {
                id: 1,
                plate: 'MKJ-121',
                capacity: 24,
                company: 'company',
                vehicleType: 'vehicleType',
                year: 2022,
                model: 'Coaster',
                brand: 'BMS',
            },
            {
                id: 2,
                plate: 'MKJ-122',
                capacity: 24,
                company: 'company',
                vehicleType: 'vehicleType',
                year: 2022,
                model: 'Coaster',
                brand: 'BMS',
            },
            {
                id: 3,
                plate: 'MKJ-123',
                capacity: 24,
                company: 'company',
                vehicleType: 'vehicleType',
                year: 2022,
                model: 'Coaster',
                brand: 'BMS',
            },
        ]);
    }),
    delete: (id: number): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    update: (driver: BusEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    create: (driver: BusEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    })
}

export default BusRepositoryTest;