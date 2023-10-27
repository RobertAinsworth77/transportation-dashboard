import EmployeeEntity from "../../../domain/entities/EmployeeEntity";
import TripEntity, { TripState } from "../../../domain/entities/TripEntity";
import TripRepository, { GetFiltredResponse } from "../../../domain/repositories/TripRepository";

const TripRepositoryTest: TripRepository = {
    getFiltred: (word: string, page: number, itemsPerPage: number): Promise<GetFiltredResponse> => new Promise<GetFiltredResponse>((resolve, reject) => {
        resolve({
            total_pages: 12,
            current_page: 2,
            total_rows: 3,
            orderBy: {
                keyName: 'id',
                isDesc: false,
            },
            trips: [
                {
                    id: 1,
                    start_date: new Date(),
                    end_date: new Date(),
                    state: TripState.pending,
                    driver_id: 1,
                    bus_id: 1,
                    route_id: 1,
                    passengers_count: 20,
                    canDelete: false,
                    canEdit: false,
                    bookings_pending_count: 10,
                    position: {
                        lat: 18.30075,
                        lng: -78.273048,
                    },
                    driver: {
                        id: 1,
                        name: 'name',
                        phone: 'phone',
                        email: 'email',
                        enabled: true,
                        country: 'country',
                        defaultBus: {
                            company: 'company',
                            vehicleType: 'vehicleType',
                            year: 2022,
                            model: 'Coaster',
                            brand: 'BMS',
                            id: 1,
                            plate: 'MKJ-123',
                            capacity: 24,
                        }
                    },
                    bus: {
                        id: 3,
                        plate: 'MKJ-123',
                        company: 'company',
                        vehicleType: 'vehicleType',
                        year: 2022,
                        model: 'Coaster',
                        brand: 'BMS',
                        capacity: 24,
                    },
                    route: {
                        id: 1,
                        name: 'name',
                        description: 'description',
                        enabled: true,
                        polylines: undefined,
                        start_point: {
                            lat: 18.30075,
                            lng: -78.073048,
                        },
                        end_point: {
                            lat: 18.28075,
                            lng: -78.073048,
                        },
                    },
                    passengers: [
                        {
                            id: 1,
                            name: 'name',
                            phone: 'phone',
                            email: 'email',
                            enabled: true,
                            country: 'country',
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
                    ],
                    bookings: [
                        {
                            id: 1,
                            name: 'name',
                            phone: 'phone',
                            email: 'email',
                            enabled: true,
                            country: 'country',
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
                    ],
                },
                {
                    id: 2,
                    start_date: new Date(),
                    end_date: new Date(),
                    state: TripState.pending,
                    driver_id: 1,
                    bus_id: 1,
                    route_id: 1,
                    passengers_count: 20,
                    bookings_pending_count: 10,
                    position: {
                        lat: 18.30075,
                        lng: -78.273048,
                    },
                    driver: {
                        id: 1,
                        name: 'name',
                        phone: 'phone',
                        email: 'email',
                        enabled: true,
                        country: 'country',
                    },
                    bus: {
                        id: 1,
                        plate: 'MKJ-123',
                        capacity: 24,
                        company: 'company',
                        vehicleType: 'vehicleType',
                        year: 2022,
                        model: 'Coaster',
                        brand: 'BMS',
                    },
                    route: {
                        id: 1,
                        name: 'name',
                        description: 'description',
                        enabled: true,
                        polylines: undefined,
                        start_point: {
                            lat: 18.30075,
                            lng: -78.073048,
                        },
                        end_point: {
                            lat: 18.28075,
                            lng: -78.073048,
                        },
                    },
                    passengers: [
                        {
                            id: 1,
                            name: 'name',
                            phone: 'phone',
                            email: 'email',
                            enabled: true,
                            country: 'country',
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
                    ],
                    bookings: [
                        {
                            id: 1,
                            name: 'name',
                            phone: 'phone',
                            email: 'email',
                            enabled: true,
                            country: 'country',
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
                    ],
                }
            ]
        });
    }),
    getById: (id: number): Promise<TripEntity> => new Promise<TripEntity>((resolve, reject) => {
        resolve({
            id: 1,
            start_date: new Date(2022, 8, 28, 6, 20),
            end_date: new Date(1998, 5, 6, 8, 20),
            state: TripState.pending,
            driver_id: 1,
            bus_id: 1,
            route_id: 1,
            passengers_count: 20,
            bookings_pending_count: 10,
            position: {
                lat: 18.30075,
                lng: -78.273048,
            },
            driver: {
                id: 1,
                name: 'name',
                phone: 'phone',
                email: 'email',
                enabled: true,
                country: 'country',
            },
            bus: {
                id: 3,
                plate: 'MKJ-123',
                capacity: 24,
                company: 'company',
                vehicleType: 'vehicleType',
                year: 2022,
                model: 'Coaster',
                brand: 'BMS',
            },
            route: {
                id: 1,
                name: 'name',
                description: 'description',
                enabled: true,
                polylines: undefined,
                start_point: {
                    lat: 18.28075,
                    lng: -78.073048,
                },
                end_point: {
                    lat: 18.28075,
                    lng: -77.873048,
                },
                site: {
                    id: 1,
                    name: 'name',
                    country: 'country',
                }
            },
            passengers: [
                // {
                //     id: 1,
                //     name: 'name',
                //     phone: 'phone',
                //     email: 'email',
                //     enabled: true,
                //     country: 'country',
                // },
                // {
                //     id: 2,
                //     name: 'name2',
                //     phone: 'phone',
                //     email: 'email',
                //     enabled: true,
                //     country: 'country',
                // },
                // {
                //     id: 3,
                //     name: 'name3',
                //     phone: 'phone',
                //     email: 'email',
                //     enabled: true,
                //     country: 'country',
                // }
            ],
            bookings: [
                // {
                //     id: 1,
                //     name: 'name',
                //     phone: 'phone',
                //     email: 'email',
                //     enabled: true,
                //     country: 'country',
                // },
                // {
                //     id: 2,
                //     name: 'name2',
                //     phone: 'phone',
                //     email: 'email',
                //     enabled: true,
                //     country: 'country',
                // },
                // {
                //     id: 3,
                //     name: 'name3',
                //     phone: 'phone',
                //     email: 'email',
                //     enabled: true,
                //     country: 'country',
                // }
            ],
        }
        );
    }),
    delete: (id: number): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    update: (trip: TripEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    create: (trip: TripEntity): Promise<void> => new Promise<void>((resolve, reject) => {
        resolve();
    }),
    getPassengersByTripId: (id: number): Promise<EmployeeEntity[]> => new Promise<EmployeeEntity[]>((resolve, reject) => {
        resolve([{
            id: 1,
            name: 'name',
            phone: 'phone',
            email: 'email',
            enabled: true,
            country: 'country',
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
        }]);
    }),
}

export default TripRepositoryTest;