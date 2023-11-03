// import './ModalSearchEmployeeModalStyles.scss';
import { FC, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import LanguageContext from '../../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../../domain/providers/language/LanguageContextType';
import KeyWordLocalization from '../../../../domain/providers/language/dictionaries/KeyWordLocalization';
import ModalsContext from '../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../domain/providers/modal/ModalsContextType';
import Validators from '../../../utils/Validators';
import DependencyInjectionContext from '../../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../../di/provider/DependencyInjectionContextType';
import EmployeeEntity from '../../../../domain/entities/EmployeeEntity';

const ModalSearchEmployee: FC<{}> = ({ }) => {
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { closeModalCustom } = useContext(ModalsContext) as ModalsContextType;
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const [loading, setLoading] = useState<boolean>(false);
    const [employee, setEmployee] = useState<EmployeeEntity | undefined | null>(undefined);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const _handleSearch = async (_: any) => {
        setEmployee(undefined);
        const response = await di.useCases.getEmployeeByEmailUseCase.call(_.email);
        setEmployee(response);
    };

    return <div className="delete_bus_modal_component">
        <form onSubmit={handleSubmit(_handleSearch)}>
            <div className="row">
                <div className={`col-12 form-group ${errors.confirm ? 'error' : ''}`}>
                    <label>{i18n(KeyWordLocalization.ModalSearchEmployeeDescription)}</label>
                    <input type="text" {...register("email", Validators({
                        required: true,
                        email: true,
                    }))} className="form-control my-2" placeholder={i18n(KeyWordLocalization.ModalSearchEmployeePlaceholder)} />
                    <ErrorMessage as="aside" errors={errors} name="email" />
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button className="w-100 btn btn-light m-md-2" type='button' onClick={closeModalCustom}>
                            {i18n(KeyWordLocalization.Cancel)}
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="w-100 btn btn_primary my-2" type='submit'>
                            {i18n(KeyWordLocalization.Search)}
                        </button>
                    </div>
                </div>
                <div className="w-100">
                    {employee === null && <div className="text-danger">{i18n(KeyWordLocalization.ModalSearchEmployeeUserNotFound)}</div>}
                    {employee !== undefined && employee !== null && <div className="text-success">{i18n(KeyWordLocalization.ModalSearchEmployeeUserFound, { 'name': employee.name + (employee.lastname ? ' ' + employee.lastname : ''), 'id': employee.id })}</div>}
                </div>
            </div>
        </form >
    </div >
};

export default ModalSearchEmployee;
