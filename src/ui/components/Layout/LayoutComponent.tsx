import { FC, useState } from 'react';
import ModalsComponent from '../modals/ModalsComponent';
import './LayoutComponent.scss';
import LayoutProps from './LayoutComponentProps';
import { MdMenuOpen, MdMenu, MdOutlineLogout, MdChevronLeft } from "react-icons/md";
import { useContext } from 'react';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import UserContext from '../../../domain/providers/user/UserContext';
import UserContextType from '../../../domain/providers/user/UserContextType';
import { routes, modules } from '../../routes/RoutesComponent';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayoutComponent from './authLayout/AuthLayoutComponent';
import DependencyInjectionContextType from '../../../di/provider/DependencyInjectionContextType';
import DependencyInjectionContext from '../../../di/provider/DependencyInjectionContext';

const LayoutComponent: FC<LayoutProps> = ({ children }) => {
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { user } = useContext(UserContext) as UserContextType;
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const navigate = useNavigate();
  const currentHref = useLocation().pathname;

  const [open, setOpen] = useState<boolean>(window.screen.width > 780);
  const _handleSignOut = async () => {
    await di.useCases.logoutUseCase.call();
    navigate(routes.signin.path);
  }

  if (user == undefined) return <ModalsComponent><AuthLayoutComponent>{children}</AuthLayoutComponent></ModalsComponent>
  return <ModalsComponent>
    <div className={`LayoutComponent ${open ? 'is_open': ''}`}>
      <div className={`side_menu ${open ? 'open' : 'close'}`} style={{ backgroundImage: 'url(./assets/bg/sidebar.png)' }}>
        <div className="header_side">
          <img src="./assets/logos/logo.png" className='logo' alt="" />
          <div className="text">
            <strong className=''>{i18n(KeyWordLocalization.TitleApp)}</strong>
            <span>{user?.name}</span>
          </div>
        </div>

        {modules.map((module, index) => <div className="module" key={index}>
          <Link to={module.page.relativePath} className={`header_module hover ${module.page.relativePath == window.location.pathname ? 'active_link' : ''}`}>
            <module.icon size={32} className="icon" />
            <span>{i18n(module.name)}</span>
          </Link>
          {module.pages.filter(page => page.users.includes(user?.role)).map((page, index) =>
            <Link to={page.relativePath} className={`page_link hover ${page.relativePath == window.location.pathname ? 'active_link' : ''}`} key={index}>
              {i18n(page.name)}
            </Link>)}
        </div>)}
        <div onClick={_handleSignOut} className="header_module hover mt-3">
          <MdOutlineLogout size={32} className="icon" />
          <span>{i18n(KeyWordLocalization.SignOut)}</span>
        </div>

      </div>
      <div className="right_side">
        <div className="header">
          {open ? <MdMenuOpen size={32} onClick={() => setOpen(false)} className="hover" /> : <MdMenu onClick={() => setOpen(true)} size={32} className="hover" />}
          <MdChevronLeft size={32} onClick={() => navigate(-1)} className="hover" />
          <div className="flex-grow-1 text-capitalize">
            {currentHref.replace('/', ' ').replaceAll("/", ' / ')}
          </div>
          <div className="d-flex flex-column align-items-end">
            <strong>{user?.name}</strong>
            <span>{user.role}</span>
          </div>
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  </ModalsComponent>
};

export default LayoutComponent;
