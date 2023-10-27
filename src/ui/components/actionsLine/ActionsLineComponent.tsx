import { FC, useContext } from "react";
import DependencyInjectionContext from "../../../di/provider/DependencyInjectionContext";
import DependencyInjectionContextType from "../../../di/provider/DependencyInjectionContextType";
import { UserEntityRole } from "../../../domain/entities/UserEntity";
import LanguageContext from "../../../domain/providers/language/LanguageContext";
import LanguageContextType from "../../../domain/providers/language/LanguageContextType";
import KeyWordLocalization from "../../../domain/providers/language/dictionaries/KeyWordLocalization";
import ModalsContext from "../../../domain/providers/modal/ModalsContext";
import ModalsContextType from "../../../domain/providers/modal/ModalsContextType";
import UserContext from "../../../domain/providers/user/UserContext";
import UserContextType from "../../../domain/providers/user/UserContextType";
import ModalSearchEmployee from "../modals/searchEmployee/ModalSearchEmployee";
import ModalSearchMultipleEmployee from "../modals/searchMultipleEmployee/ModalSearchMultipleEmployee";

const ActionsLineComponent: FC<{}> = () => {
    const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
    const { user } = useContext(UserContext) as UserContextType;
    const { openModalCustom } = useContext(ModalsContext) as ModalsContextType;
    const { i18n } = useContext(LanguageContext) as LanguageContextType;

    const _handleCheckUserByEmail = () => openModalCustom('lg', i18n(KeyWordLocalization.ActionLineComponentCheckEmailModelTitle), <ModalSearchEmployee />)
    const _handleCheckUsersByHRM = () => openModalCustom('lg', i18n(KeyWordLocalization.ActionLineComponentCheckMultiplebyHRMModelTitle), <ModalSearchMultipleEmployee />)

    return <div className="row">
        <h4>{i18n(KeyWordLocalization.ActionLineComponentActions)}</h4>
        {user?.role == UserEntityRole.admin && <div className="col-12 col-lg-4 my-3 hover" onClick={_handleCheckUserByEmail}>
            <div className="card">
                <div className="card-body p-2">
                    {i18n(KeyWordLocalization.ActionLineComponentCheckEmail)}
                </div>
            </div>
        </div>}
        {user?.role == UserEntityRole.admin && <div className="col-12 col-lg-4 my-3 hover" onClick={_handleCheckUsersByHRM}>
            <div className="card">
                <div className="card-body p-2">
                    {i18n(KeyWordLocalization.ActionLineComponentCheckMultipleByHRM)}
                </div>
            </div>
        </div>}
    </div>
}

export default ActionsLineComponent;