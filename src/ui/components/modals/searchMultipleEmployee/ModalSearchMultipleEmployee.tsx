// import './ModalSearchMultipleEmployeeModalStyles.scss';
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

const ModalSearchMultipleEmployee: FC<{}> = ({ }) => {
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { closeModalCustom, addToast } = useContext(ModalsContext) as ModalsContextType;
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const [employees, setEmployees] = useState<EmployeeEntity[] | null>(null);
    const [searchingHrms, setSearchingHrms] = useState<string[]>([]);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const _handleSearch = async (_: any) => {
        setEmployees(null);
        const hrms = _.hrms.replaceAll(' ', '').split(',');
        setSearchingHrms(hrms);
        console.log('send hrms', hrms)
        const response = await di.useCases.getEmployeesByHrmUseCase.call(hrms);
        console.log('employee response', response)
        if (response == null) {
            addToast(i18n(KeyWordLocalization.ModalSearchMultipleEmployeeError), 'error', undefined);
            return setSearchingHrms([]);
        }
        setEmployees(response);
    };

    const _getEmployeeOfEmploye = (hrm: string): EmployeeEntity | undefined => {
        return employees?.find(employee => employee?.id?.toString() == hrm);
    }

    const _checkOnlyNumbersAndCommas = (e: React.ChangeEvent<HTMLInputElement>) => {
        //if e only accepts numbers and commas, could be multiple commas, remove all character diferent or letter
        console.log('e', e);
        let result = e.target.value.replaceAll(/[^0-9,]/g, '');
        result = result.replace(/,/g, ', ');
        console.log('result', result);
        setValue('hrms', result);
    }

    return <div className="delete_bus_modal_component">
        <form onSubmit={handleSubmit(_handleSearch)}>
            <div className="row">
                <div className={`col-12 form-group ${errors.confirm ? 'error' : ''}`}>
                    <label>{i18n(KeyWordLocalization.ModalSearchMultipleEmployeeDescription)}</label>
                    <input type="hrms" {...register("hrms", Validators({
                        required: true,
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => _checkOnlyNumbersAndCommas(e),
                        pattern: {
                            pattern: /^\s*\d+\s*(,\s*\d+\s*)*$/,
                            message: i18n(KeyWordLocalization.ModalSearchMultipleEmployeeErrorPattern)
                        }
                    }))} className="form-control my-2" placeholder={i18n(KeyWordLocalization.ModalSearchMultipleEmployeePlaceholder)} />
                    <span className="text_light text_small">{i18n(KeyWordLocalization.ModalSearchMultipleEmployeeExample)}</span>
                    <ErrorMessage as="aside" errors={errors} name="hrms" />
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button className="w-100 btn btn-light m-md-2" type='button' onClick={closeModalCustom}>
                            {i18n(KeyWordLocalization.Cancel)}
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="w-100 btn btn_primary my-2" disabled={searchingHrms.length > 0 && employees == null} type='submit'>
                            {i18n(KeyWordLocalization.Search)}
                        </button>
                    </div>
                </div>
                <div className="w-100">
                    {employees != null && searchingHrms.map((hrm, index) =>
                        _getEmployeeOfEmploye(hrm) != null ?
                            <div className="text-success">{i18n(KeyWordLocalization.ModalSearchMultipleEmployeeUserFound, { 'name': _getEmployeeOfEmploye(hrm)!.name + (_getEmployeeOfEmploye(hrm)!.lastname ? ' ' + _getEmployeeOfEmploye(hrm)!.lastname : ''), 'hrm': _getEmployeeOfEmploye(hrm)!.id, 'email': _getEmployeeOfEmploye(hrm)!.email })}</div> :
                            <div key={index} className="text-danger">{i18n(KeyWordLocalization.ModalSearchMultipleEmployeeUserNotFound, { 'hrm': hrm })}</div>)}
                </div>
            </div>
        </form >
    </div >
};

export default ModalSearchMultipleEmployee;
