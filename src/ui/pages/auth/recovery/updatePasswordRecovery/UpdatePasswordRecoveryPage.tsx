import './UpdatePasswordRecoveryStyles.scss';
import { ErrorMessage } from "@hookform/error-message";
import { FC, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import DependencyInjectionContext from "../../../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../../../di/provider/DependencyInjectionContextType";
import KeyWordLocalization from "../../../../../domain/providers/language/dictionaries/KeyWordLocalization";
import LanguageContext from "../../../../../domain/providers/language/LanguageContext";
import LanguageContextType from "../../../../../domain/providers/language/LanguageContextType";
import Validators from "../../../../utils/Validators";
import ModalsContext from '../../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../../domain/providers/modal/ModalsContextType';
import { routes } from '../../../../routes/RoutesComponent';
import UpdatePasswordTimerComponent from './timer/UpdatePasswordTimerComponent';

const UpdatePasswordRecoveryPage: FC<{}> = () => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { addToast } = useContext(ModalsContext) as ModalsContextType;
    const { email } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

   
    const onSubmit = async (data: any) => {
        try {
            const response = await di.useCases.updatePasswordRecoveryUseCase.call(email!, data.password, data.code);
            addToast(i18n(KeyWordLocalization.UpdatePasswordRecoveryPageUpdatedPassword), 'success', null);
            navigate(routes.signin.relativePath);
        } catch (error) {
            addToast(i18n(KeyWordLocalization.UpdatePasswordRecoveryPageErrorUpdatingPassword), 'error', null);
        }
    };



    return (
        <div className='update_password_recovery_page'>
            <span className=''>{i18n(KeyWordLocalization.UpdatePasswordRecoveryPageTitle)}</span>
            <form className="row my-3" onSubmit={handleSubmit(onSubmit)}>
                <div className={`col-12 my-2 form-group ${errors.code ? 'error' : ''}`}>
                    <label>{i18n(KeyWordLocalization.UpdatePasswordRecoveryPageCode)}</label>
                    <input type="number" className="form-control" placeholder={i18n(KeyWordLocalization.UpdatePasswordRecoveryPageCode)}
                        {...register('code', Validators({ required: true, minValue:0, maxValue: 999999 }))} />
                    <ErrorMessage as="aside" errors={errors} name="code" />
                </div>
                <div className={`col-12 my-2 form-group ${errors.password ? 'error' : ''}`}>
                    <label>{i18n(KeyWordLocalization.UpdatePasswordRecoveryPagePassword)}</label>
                    <input type="password" className="form-control" placeholder={i18n(KeyWordLocalization.UpdatePasswordRecoveryPagePassword)}
                        {...register('password', Validators({ required: true }))} />
                    <ErrorMessage as="aside" errors={errors} name="password" />
                </div>
                <div className={`col-12 my-2 form-group ${errors.confirm_password ? 'error' : ''}`}>
                    <label>{i18n(KeyWordLocalization.UpdatePasswordRecoveryPagePasswordConfirm)}</label>
                    <input type="password" {...register("confirm_password", Validators({
                        required: true, minLength: 6, validate: (val: string) => {
                            if (watch('password') != val) {
                                return i18n(KeyWordLocalization.UpdatePasswordRecoveryPagePasswordNotMatch);
                            }
                        },
                    }))} className="form-control" placeholder={i18n(KeyWordLocalization.UpdatePasswordRecoveryPagePasswordConfirm)} />
                    <ErrorMessage as="aside" errors={errors} name="confirm_password" />
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn_primary mb-4 w-100">{i18n(KeyWordLocalization.UpdatePasswordRecoveryPageSubmit)}</button>
                </div>
                {email && <UpdatePasswordTimerComponent email={email} />}
            </form>
        </div>
    );
};

export default UpdatePasswordRecoveryPage;