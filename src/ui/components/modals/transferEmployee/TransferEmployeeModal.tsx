import { FC, useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import LanguageContext from '../../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../../domain/providers/language/LanguageContextType';
import KeyWordLocalization from '../../../../domain/providers/language/dictionaries/KeyWordLocalization';
import ModalsContext from '../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../domain/providers/modal/ModalsContextType';
import DependencyInjectionContext from '../../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../../di/provider/DependencyInjectionContextType';
import EmployeeEntity from '../../../../domain/entities/EmployeeEntity';
import TripEntity from '../../../../domain/entities/TripEntity';
import Validators from '../../../utils/Validators';

interface TransferEmployeeModalProps {
    employees: EmployeeEntity[];
    currentTripId: number;
    onTransferComplete: () => void;
}

const TransferEmployeeModal: FC<TransferEmployeeModalProps> = ({ employees, currentTripId, onTransferComplete }) => {
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { closeModalCustom } = useContext(ModalsContext) as ModalsContextType;
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    
    const [loading, setLoading] = useState<boolean>(false);
    const [trips, setTrips] = useState<TripEntity[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        loadAvailableTrips();
    }, []);

    const loadAvailableTrips = async () => {
        try {
            const response = await di.useCases.getFiltredTripsUseCase?.call('', 1, 100, undefined);
            setTrips(response?.trips?.filter(trip => trip.id !== currentTripId) || []);
        } catch (error) {
            setTrips([]);
        }
    };

    const handleEmployeeSelection = (employeeId: number) => {
        setSelectedEmployees(prev => 
            prev.includes(employeeId) 
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const handleSelectAll = () => {
        if (selectedEmployees.length === employees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map(e => e.id));
        }
    };

    const handleTransfer = async (data: any) => {
        if (selectedEmployees.length === 0) return;
        
        setLoading(true);
        try {
            await di.useCases.transferEmployeeUseCase.call({
                employeeIds: selectedEmployees,
                fromTripId: currentTripId,
                toTripId: parseInt(data.toTripId)
            });
            onTransferComplete();
            closeModalCustom();
        } catch (error) {
            console.error('Transfer failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="transfer_employee_modal">
            <form onSubmit={handleSubmit(handleTransfer)}>
                <div className="row">
                    <div className="col-12 mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0">Select Passengers to Transfer:</h6>
                            <button 
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                onClick={handleSelectAll}
                            >
                                {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        <div className="border rounded p-3" style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                            {employees.map(employee => (
                                <div key={employee.id} className="form-check mb-2 p-2 bg-white rounded">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`employee-${employee.id}`}
                                        checked={selectedEmployees.includes(employee.id)}
                                        onChange={() => handleEmployeeSelection(employee.id)}
                                    />
                                    <label className="form-check-label ms-2" htmlFor={`employee-${employee.id}`}>
                                        <strong>{employee.name} {employee.lastname}</strong>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <small className="text-muted mt-1 d-block">
                            {selectedEmployees.length} of {employees.length} passenger(s) selected
                        </small>
                    </div>
                    
                    <div className="col-12 form-group">
                        <label className="fw-bold mb-2">Transfer to Trip:</label>
                        <select 
                            {...register("toTripId", Validators({ required: true }))} 
                            className="form-select"
                        >
                            <option value="">Select destination trip...</option>
                            {trips.map(trip => (
                                <option key={trip.id} value={trip.id}>
                                    Trip #{trip.id} - {trip.route?.name} ({trip.start_date.toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                        <ErrorMessage as="aside" errors={errors} name="toTripId" />
                    </div>
                </div>
                
                <div className="row mt-4">
                    <div className="col-md-6">
                        <button className="w-100 btn btn-secondary" type='button' onClick={closeModalCustom}>
                            Cancel
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button 
                            className="w-100 btn btn-primary" 
                            type='submit' 
                            disabled={loading || selectedEmployees.length === 0}
                        >
                            {loading ? 'Transferring...' : `Transfer ${selectedEmployees.length} Passenger(s)`}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TransferEmployeeModal;
