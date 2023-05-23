import { FC, useContext, useEffect, useState } from 'react';
import CardCounterComponent from '../../components/cardCounter/CardCounterComponent';
import { routes } from '../../routes/RoutesComponent';
import './TransportPage.scss';
import TransportPageProps from './TransportPageProps';
import * as GetAllKindUsersCountUseCase from '../../../domain/use_cases/default/GetAllKindUsersCountUseCase';
import * as GetAllCountersRelatedToTripUseCase from '../../../domain/use_cases/default/GetAllCountersRelatedToTripUseCase';
import DependencyInjectionContext from '../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../di/provider/DependencyInjectionContextType';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import AddUserModalComponent from '../user/components/add/AddUserModalComponent';
import ModalsContextType from '../../../domain/providers/modal/ModalsContextType';
import ModalsContext from '../../../domain/providers/modal/ModalsContext';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import AddDriverModalComponent from '../driver/components/add/AddDriverModalComponent';
import { useNavigate } from 'react-router-dom';
import AddSiteModalComponent from '../sites/components/add/AddSiteModalComponent';
import { UserEntityRole } from '../../../domain/entities/UserEntity';
import UserContext from '../../../domain/providers/user/UserContext';
import UserContextType from '../../../domain/providers/user/UserContextType';
import AddBusModalComponent from '../busses/components/add/AddBusModalComponent';

const TransportPage: FC<TransportPageProps> = () => {

  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { user } = useContext(UserContext) as UserContextType;
  const { openModalCustom } = useContext(ModalsContext) as ModalsContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const navigate = useNavigate();

  const [countersUsers, setCounterUsers] = useState<GetAllKindUsersCountUseCase.response | undefined>(undefined);
  const [countersTrips, setCounterTrips] = useState<GetAllCountersRelatedToTripUseCase.response | undefined>(undefined);

  const _getCounters = async () => {
    try {
      const _countersUsers = await di.useCases.getAllKindUsersCountUseCase.call();
      setCounterUsers(_countersUsers);
      const _countersTrips = await di.useCases.getAllCountersRelatedToTripUseCase.call();
      setCounterTrips(_countersTrips);
    } catch (error) {
    }
  }
  const _handleAddDriver = () => openModalCustom('lg', i18n(KeyWordLocalization.DriversPageAddDriver), <AddDriverModalComponent done={_getCounters} />)
  const _handleAddUser = () => openModalCustom('lg', i18n(KeyWordLocalization.UsersPageAddUser), <AddUserModalComponent done={_getCounters} />)
  const _handleAddBus = () => openModalCustom('lg', i18n(KeyWordLocalization.BussesPageAddBus), <AddBusModalComponent done={_getCounters} />)
  const _handleAddTrip = () => navigate(routes.add_trip.relativePath);
  const _handleAddRoute = () => navigate(routes.add_route.relativePath);
  const _handleAddSite = () => openModalCustom('lg', i18n(KeyWordLocalization.SitesPageAddSite), <AddSiteModalComponent done={_getCounters} />)

  useEffect(() => {
    _getCounters();
  }, []);

  return <div className="TransportPage bg_2">
    <div className="container mt-5">
      <h4>{i18n(KeyWordLocalization.HomePageTripsDashboard)}</h4>
      <div className="row">
        <div className="col-12 col-lg-4 my-3">
          <CardCounterComponent title={i18n(KeyWordLocalization.HomePageBussesModule)} counter={countersTrips?.busses_count ?? 0} add={_handleAddBus} seeAllUrl={routes.busses.relativePath} />
        </div>
        <div className="col-12 col-lg-4 my-3">
          <CardCounterComponent title={i18n(KeyWordLocalization.HomePageSitesModule)} counter={countersTrips?.sites_count ?? 0} add={_handleAddSite} seeAllUrl={routes.drivers.relativePath} />
        </div>
        <div className="col-12 col-lg-4 my-3">
          <CardCounterComponent title={i18n(KeyWordLocalization.HomePageTripsModule)} counter={countersTrips?.trips_count ?? 0} add={_handleAddTrip} seeAllUrl={routes.users.relativePath} />
        </div>
        <div className="col-12 col-lg-4 my-3">
          <CardCounterComponent title={i18n(KeyWordLocalization.HomePageRoutesModule)} counter={countersTrips?.routes_count ?? 0} add={_handleAddRoute} seeAllUrl={routes.routes.relativePath} />
        </div>
      </div>
    </div>
  </div>
}

export default TransportPage;