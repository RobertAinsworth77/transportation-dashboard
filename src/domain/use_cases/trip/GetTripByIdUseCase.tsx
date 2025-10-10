import TripRepositoryTest from "../../../data/repositories/trip/TripRepositoryTest";
import EmployeeEntity, { EmployeePassengerStatus } from "../../entities/EmployeeEntity";
import TripEntity from "../../entities/TripEntity";
import TripRepository from "../../repositories/TripRepository";

interface props { tripRepository: TripRepository }
export default class GetTripByIdUseCase {
    _tripRepository: TripRepository;

    constructor(_: props) {
        this._tripRepository = _.tripRepository;
    }

    public call = async (id: number) => new Promise<TripEntity>(async (resolve, reject) => {
        try {
            const response = await this._tripRepository.getById(id);
            
            // Make passengers call non-blocking with timeout
            console.log('🚀 Starting passengers call for trip:', id);
            const passengersPromise = Promise.race([
                this._tripRepository.getPassengersByTripId(id),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Passengers timeout')), 5000))
            ]);
            
            try {
                const passengersResponse = await passengersPromise as EmployeeEntity[];
                console.log('✅ Passengers data received:', passengersResponse);
                response.passengers = passengersResponse.filter((passenger: EmployeeEntity) => passenger.passengerStatus == EmployeePassengerStatus.COMPLETED);
                response.bookings = passengersResponse.filter((passenger: EmployeeEntity) => passenger.passengerStatus == EmployeePassengerStatus.PENDING);
                console.log('📊 Filtered passengers:', response.passengers.length, 'bookings:', response.bookings.length);
            } catch (error) { 
                console.log('⚠️ Passengers call failed or timed out:', error);
                console.log('🔄 Continuing without passenger data...');
                response.passengers = [];
                response.bookings = [];
            }
            
            return resolve(response);
        } catch (_) {
            console.log('error in get trip by id use case', _);
            return reject();
        }
    });
}