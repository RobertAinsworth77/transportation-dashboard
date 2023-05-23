import './LoadingComponent.scss';
import { FC, useContext } from 'react';
import LoadingComponentProps from './LoadingComponentProps';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';


const LoadingComponent: FC<LoadingComponentProps> = ({ showLogo }) => {
  const {i18n} = useContext(LanguageContext) as LanguageContextType;
  return <div className="loading_component">
    {showLogo && <img src="./assets/logos/logo.png" className='logo' alt="" />}
    <strong className='mb-3'>{i18n(KeyWordLocalization.Loading)}</strong>
    <div className="centered_spinner">
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  </div>
}

LoadingComponent.defaultProps = {
  showLogo: false
}

export default LoadingComponent;
