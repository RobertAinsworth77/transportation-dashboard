import { FC, useContext, useEffect } from 'react';
import './NotFoundStyle.scss';
import NotFoundComponentProps from './NotFoundComponentProps';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import UserContextType from '../../../domain/providers/user/UserContextType';
import UserContext from '../../../domain/providers/user/UserContext';
import { routes } from '../../routes/RoutesComponent';

const NotFoundComponent: FC<NotFoundComponentProps> = () => {
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { user } = useContext(UserContext) as UserContextType;
  const navigate = useNavigate();
  const currentHref = useLocation().pathname;

  useEffect(() => {
    if (user != undefined && currentHref == routes.signin.relativePath) navigate(routes.home.relativePath);
    if(user == undefined && currentHref != routes.home.relativePath) navigate(routes.signin.relativePath)
  }, [user, navigate]);

  return <div className="not_found_component  d-flex align-items-center">
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6"><img src="./assets/images/404-error.png" className='img-fluid' alt="" /></div>
        <div className="col-md-6 d-flex align-items-center">
          <div className="">
          <h3 className="text-left">
            {i18n(KeyWordLocalization.NotFoundComponentMiniTitle)}
          </h3>
          <h1 className="text_yellow text_bold text-justify" style={{fontSize: '3.7rem'}}>
            {i18n(KeyWordLocalization.NotFoundComponentTitle)}
          </h1>
          <h4 className="text-end">
            {i18n(KeyWordLocalization.NotFoundComponentDescription)}
          </h4>
          <div className="d-flex justify-content-end px-3 mt-3">
            <Link to={user != undefined ? routes.home.relativePath : routes.signin.relativePath} className="btn btn_primary">{i18n(KeyWordLocalization.NotFoundComponentGoHome)}</Link>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default NotFoundComponent;
