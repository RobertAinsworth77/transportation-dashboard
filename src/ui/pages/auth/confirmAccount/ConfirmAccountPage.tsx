import './ConfirmAccountStyles.scss';
import { ErrorMessage } from "@hookform/error-message";
import { FC, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import DependencyInjectionContext from '../../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../../di/provider/DependencyInjectionContextType';
import KeyWordLocalization from '../../../../domain/providers/language/dictionaries/KeyWordLocalization';
import LanguageContext from '../../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../../domain/providers/language/LanguageContextType';
import ModalsContext from '../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../domain/providers/modal/ModalsContextType';
import Validators from '../../../utils/Validators';
import ReactInputVerificationCode from 'react-input-verification-code';
import { routes } from '../../../routes/RoutesComponent';

const ConfirmAccountPage: FC<{}> = () => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { addToast } = useContext(ModalsContext) as ModalsContextType;
    const { email } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();

    const [timer, setTimer] = useState(5);

    const onSubmit = async (data: any) => {
        try {
            await di.useCases.confirmAccountUseCase.call(email!, data.code);
            addToast(i18n(KeyWordLocalization.ConfirmAccountPageConfirmedAccount), 'success', null);
            navigate(routes.signin.relativePath);
        } catch (error) {
            addToast(i18n(KeyWordLocalization.ConfirmAccountPageErrorConfirmingAccount), 'error', null);
        }
    };

    const _countdownFunc = () => {
        setTimer(timer - 1);
    }

    var interval = setInterval(_countdownFunc, 1000);

    const _resendCode = async () => {
        console.log('timer', timer);
        if (timer > 0) return;
        try {
            await di.useCases.sendCodeConfirmAccountUseCase.call(email!);
            addToast(i18n(KeyWordLocalization.ConfirmAccountPageResendCode), 'success', null);
        } catch (error) {
            addToast(i18n(KeyWordLocalization.UnknownError), 'error', null);
        }
        setTimer(5);
        interval = setInterval(_countdownFunc, 1000);
    }

    useEffect(() => {
        // interval();
        setTimer(5);
    }, [email])

    return (
        <div className='update_password_recovery_page'>
            <span className=''>{i18n(KeyWordLocalization.ConfirmAccountPageTitle)}</span>
            <form className="row my-3" onSubmit={handleSubmit(onSubmit)}>
                <div className={`col-12 my-2 mb-4 form-group ${errors.code ? 'error' : ''}`}>
                    <div className="d-flex justify-content-center">
                        <div className="reduced">
                            <ReactInputVerificationCode length={6} onChange={(val) => setValue('code', val)} />
                        </div>
                    </div>
                    <input type="hidden"  {...register('code', Validators({ required: true, mustBeNumber: true, minValue: 0, maxValue: 999999 }))} />
                    <ErrorMessage as="aside" errors={errors} name="code" />
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn_primary mb-4 w-100">{i18n(KeyWordLocalization.ConfirmAccountPageSubmit)}</button>
                </div>
                <div onClick={_resendCode} className={`${timer > 0 ? 'disabled' : 'hover'} forget_password_link mt-0 small`} >{i18n(KeyWordLocalization.ConfirmAccountPageResendCode, { timer: timer > 0 ? timer : '' })}</div>
            </form>
        </div>
    );
};

export default ConfirmAccountPage;