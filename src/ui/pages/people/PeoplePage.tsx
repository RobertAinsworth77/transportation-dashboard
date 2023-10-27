import './PeoplePage.scss';
import { FC, useContext, useEffect, useState } from 'react';
import CardCounterComponent from '../../components/cardCounter/CardCounterComponent';
import { routes } from '../../routes/RoutesComponent';
import PeoplePageProps from './PeoplePageProps';
import * as GetAllKindUsersCountUseCase from '../../../domain/use_cases/default/GetAllKindUsersCountUseCase';
import UserContext from '../../../domain/providers/user/UserContext';
import UserContextType from '../../../domain/providers/user/UserContextType';
import DependencyInjectionContext from '../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../di/provider/DependencyInjectionContextType';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import AddUserModalComponent from '../user/components/add/AddUserModalComponent';
import ModalsContextType from '../../../domain/providers/modal/ModalsContextType';
import ModalsContext from '../../../domain/providers/modal/ModalsContext';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import AddDriverModalComponent from '../driver/components/add/AddDriverModalComponent';
import { UserEntityRole } from '../../../domain/entities/UserEntity';
import ModalSearchEmployee from '../../components/modals/searchEmployee/ModalSearchEmployee';
import ActionsLineComponent from '../../components/actionsLine/ActionsLineComponent';

const PeoplePage: FC<PeoplePageProps> = () => {

  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { user } = useContext(UserContext) as UserContextType;
  const { openModalCustom } = useContext(ModalsContext) as ModalsContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;

  const [countersUsers, setCounterUsers] = useState<GetAllKindUsersCountUseCase.response | undefined>(undefined);

  const _getCounters = async () => {
    try {
      const _countersUsers = await di.useCases.getAllKindUsersCountUseCase.call();
      setCounterUsers(_countersUsers);
    } catch (error) {
    }
  }
  const _handleAddDriver = () => openModalCustom('lg', i18n(KeyWordLocalization.DriversPageAddDriver), <AddDriverModalComponent done={_getCounters} />)
  const _handleAddUser = () => openModalCustom('lg', i18n(KeyWordLocalization.UsersPageAddUser), <AddUserModalComponent done={_getCounters} />)

  useEffect(() => {
    _getCounters();
  }, []);

  return <div className="people_page">
    <div className="container">
      <h4>{i18n(KeyWordLocalization.HomePageUsersDashboard)}</h4>
      <div className="row">
        <div className="col-12 col-lg-4 my-3">
          <CardCounterComponent title={i18n(KeyWordLocalization.HomePageDriversModule)} counter={countersUsers?.drivers_count ?? 0} add={_handleAddDriver} seeAllUrl={routes.drivers.relativePath} />
        </div>
        {user?.role == UserEntityRole.admin && <div className="col-12 col-lg-4 my-3">
          <CardCounterComponent title={i18n(KeyWordLocalization.HomePageUsersModule)} counter={countersUsers?.users_count ?? 0} add={_handleAddUser} seeAllUrl={routes.users.relativePath} />
        </div>}
      </div>
      <ActionsLineComponent />
    </div>
  </div>
}

export default PeoplePage;