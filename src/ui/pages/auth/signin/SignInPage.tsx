import './SignInStyles.scss';
import { ErrorMessage } from "@hookform/error-message";
import { FC, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import DependencyInjectionContext from "../../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../../di/provider/DependencyInjectionContextType";
import KeyWordLocalization from "../../../../domain/providers/language/dictionaries/KeyWordLocalization";
import LanguageContext from "../../../../domain/providers/language/LanguageContext";
import LanguageContextType from "../../../../domain/providers/language/LanguageContextType";
import Validators from "../../../utils/Validators";
import { routes } from '../../../routes/RoutesComponent';
import ModalsContext from '../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../domain/providers/modal/ModalsContextType';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const SignInPage: FC<{}> = () => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { addToast } = useContext(ModalsContext) as ModalsContextType;
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            const response = await di.useCases.loginUseCase.call(data.email, data.password);
            console.log('response logged');
            if (response != null) {
                navigate(routes.home.relativePath);
            } else {
                addToast(i18n(KeyWordLocalization.SingInPageWrongCredentials), 'error', null);
            }
        } catch (error: any) {
            if (error.name == 'NotAuthorizedException') {
                addToast(i18n(KeyWordLocalization.SingInPageWrongCredentials), 'error', null);
            } else if (error.name == 'UserNotConfirmedException') {
                navigate(routes.confimr_account.relativePath + '/' + data.email);
            } else {
                addToast(i18n(KeyWordLocalization.UnknownError), 'error', null);
            }
        }
    };

    return (
        <div className='sign_in_page'>
            <h5>{i18n(KeyWordLocalization.SignInPageTitle)}</h5>
            <form className="row" onSubmit={handleSubmit(onSubmit)}>
                <div className={`col-12 mb-3 form-group ${errors.email ? 'error' : ''}`}>
                    <label>{i18n(KeyWordLocalization.SignInPageEmail)}</label>
                    <input type="email" className="form-control" placeholder={i18n(KeyWordLocalization.SignInPageEmail)}
                        {...register('email', Validators({ required: true }))} />
                    <ErrorMessage as="aside" errors={errors} name="email" />
                </div>
                <div className={`col-12 mb-3 form-group ${errors.password ? 'error' : ''}`}>
                    <label>{i18n(KeyWordLocalization.SignInPagePassword)}</label>
                    <div className="password_input_wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control" placeholder={i18n(KeyWordLocalization.SignInPagePassword)}
                            {...register('password', Validators({ required: true }))} />
                        <div className="visibility_icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                        </div>
                    </div>
                    <ErrorMessage as="aside" errors={errors} name="password" />
                </div>
                <Link className="forget_password_link mt-0 small" to={routes.send_code_recovery.relativePath}>{i18n(KeyWordLocalization.SignInPageDoYouForgetPassword)}</Link>
                <button type="submit" className="btn btn_primary mt-4">{i18n(KeyWordLocalization.SignInPageSubmit)}</button>
            </form>
        </div >
    );
};

export default SignInPage;