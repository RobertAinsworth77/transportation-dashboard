import { useContext, useEffect, useState } from "react";
import UpdatePasswordTimerComponentProps from "./UpdatePasswordTimerComponentProps";
import DependencyInjectionContext from "../../../../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../../../../di/provider/DependencyInjectionContextType";
import KeyWordLocalization from "../../../../../../domain/providers/language/dictionaries/KeyWordLocalization";
import LanguageContext from "../../../../../../domain/providers/language/LanguageContext";
import LanguageContextType from "../../../../../../domain/providers/language/LanguageContextType";

const _defaultTimer = 5;
var interval: any = null;
const UpdatePasswordTimerComponent: React.FC<UpdatePasswordTimerComponentProps> = ({email}) => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    
    const [timer, setTimer] = useState(_defaultTimer);

    const _countdownFunc = () => {
        clearInterval(interval);
        if(timer <= 0) {
            clearInterval(interval);
            setTimer(0);
            return;
        }else{
            setTimer(timer - 1);
        }
    }

    interval = setInterval(_countdownFunc, 1000);

    const _resendCode = () => {
        if (timer > 0) return;
        di.useCases.sendCodeRecoveryUseCase.call(email!);
        setTimer(_defaultTimer);
        interval = setInterval(_countdownFunc, 1000);
    }

    useEffect(() => {
        console.log('timer effect', timer);
    }, [email])
    return <div onClick={_resendCode} className={`${timer > 0 ? 'disabled' : 'hover'} forget_password_link mt-0 small`} >{i18n(KeyWordLocalization.UpdatePasswordRecoveryPageResendCode, { timer: timer > 0 ? timer : '' })}</div>
}

export default UpdatePasswordTimerComponent;