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
                        <h6>Select Employees to Transfer:</h6>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {employees.map(employee => (
                                <div key={employee.id} className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`employee-${employee.id}`}
                                        checked={selectedEmployees.includes(employee.id)}
                                        onChange={() => handleEmployeeSelection(employee.id)}
                                    />
                                    <label className="form-check-label" htmlFor={`employee-${employee.id}`}>
                                        {employee.name} {employee.lastname}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="col-12 form-group">
                        <label>Transfer to Trip:</label>
                        <select 
                            {...register("toTripId", Validators({ required: true }))} 
                            className="form-control"
                        >
                            <option value="">Select a trip...</option>
                            {trips.map(trip => (
                                <option key={trip.id} value={trip.id}>
                                    Trip #{trip.id} - {trip.route?.name} ({trip.start_date.toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                        <ErrorMessage as="aside" errors={errors} name="toTripId" />
                    </div>
                </div>
                
                <div className="row mt-3">
                    <div className="col-md-6">
                        <button className="w-100 btn btn-light" type='button' onClick={closeModalCustom}>
                            Cancel
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button 
                            className="w-100 btn btn-primary" 
                            type='submit' 
                            disabled={loading || selectedEmployees.length === 0}
                        >
                            {loading ? 'Transferring...' : `Transfer ${selectedEmployees.length} Employee(s)`}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TransferEmployeeModal;
