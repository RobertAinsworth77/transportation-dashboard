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
            try {
                const passengersResponse = await this._tripRepository.getPassengersByTripId(id);
                response.passengers = passengersResponse.filter((passenger: EmployeeEntity) => passenger.passengerStatus == EmployeePassengerStatus.COMPLETED);
                response.bookings = passengersResponse.filter((passenger: EmployeeEntity) => passenger.passengerStatus == EmployeePassengerStatus.PENDING);
            } catch (_) { }
            return resolve(response);
        } catch (_) {
            console.log('error in get trip by id use case', _);
            return reject();
        }
    });
}