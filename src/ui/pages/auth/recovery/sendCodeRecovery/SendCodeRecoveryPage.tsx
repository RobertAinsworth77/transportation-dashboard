import './SendCodeRecoveryStyles.scss';
import { ErrorMessage } from "@hookform/error-message";
import { FC, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import DependencyInjectionContext from "../../../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../../../di/provider/DependencyInjectionContextType";
import KeyWordLocalization from "../../../../../domain/providers/language/dictionaries/KeyWordLocalization";
import LanguageContext from "../../../../../domain/providers/language/LanguageContext";
import LanguageContextType from "../../../../../domain/providers/language/LanguageContextType";
import Validators from "../../../../utils/Validators";
import ModalsContext from '../../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../../domain/providers/modal/ModalsContextType';
import { routes } from '../../../../routes/RoutesComponent';

const SendCodeRecoveryPage: FC<{}> = () => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { addToast } = useContext(ModalsContext) as ModalsContextType;
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        try {
            const response = di.useCases.sendCodeRecoveryUseCase.call(data.email);
            if (response != null) {
                addToast(i18n(KeyWordLocalization.SendCodeRecoveryPageCodeSent), 'success', null);
                navigate(routes.update_passowrd_recovery.relativePath + '/' + data.email);
            } else {
                addToast(i18n(KeyWordLocalization.SendCodeRecoveryPageEmailNotFound), 'error', null);
            }
        } catch (error) {
            addToast(i18n(KeyWordLocalization.SendCodeRecoveryPageEmailNotFound), 'error', null);
        }
    };

    return (
        <div className='send_code_recovery_page'>
            <span className=''>{i18n(KeyWordLocalization.SendCodeRecoveryPageTitle)}</span>
            <form className="row my-3" onSubmit={handleSubmit(onSubmit)}>
                <div className={`col-12 mb-3 form-group ${errors.email ? 'error' : ''}`}>
                    <label>{i18n(KeyWordLocalization.SendCodeRecoveryPageEmail)}</label>
                    <input type="email" className="form-control" placeholder={i18n(KeyWordLocalization.SendCodeRecoveryPageEmail)}
                        {...register('email', Validators({ required: true }))} />
                    <ErrorMessage as="aside" errors={errors} name="email" />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn_primary mb-4 w-100">{i18n(KeyWordLocalization.SendCodeRecoveryPageSubmit)}</button>
                </div>
                <Link className="forget_password_link mt-0 small" to={routes.signin.relativePath}>{i18n(KeyWordLocalization.SendCodeRecoveryPageIRememberMyPassword)}</Link>
            </form>
        </div>
    );
};

export default SendCodeRecoveryPage;