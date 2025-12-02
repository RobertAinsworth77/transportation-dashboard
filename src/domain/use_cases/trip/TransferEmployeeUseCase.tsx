import TripRepository from "../../repositories/TripRepository";

export interface request {
    employeeIds: number[];
    fromTripId: number;
    toTripId: number;
}

export interface response {
    success: boolean;
}

interface Dependencies {
    tripRepository: TripRepository;
}

export default class TransferEmployeeUseCase {
    private tripRepository: TripRepository;

    constructor(dependencies: Dependencies) {
        this.tripRepository = dependencies.tripRepository;
    }

    async call(request: request): Promise<response> {
        await this.tripRepository.transferEmployees(request.employeeIds, request.fromTripId, request.toTripId);
        return { success: true };
    }
}
