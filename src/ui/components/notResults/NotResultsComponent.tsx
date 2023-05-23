import { FC, useContext } from 'react';
import './NotResultsStyle.scss';
import NotResultsComponentProps from './NotResultsComponentProps';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import UserContextType from '../../../domain/providers/user/UserContextType';
import UserContext from '../../../domain/providers/user/UserContext';


const NotResultsComponent: FC<NotResultsComponentProps> = () => {
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { user } = useContext(UserContext) as UserContextType;
  return <div className="not_results_component">
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6"><img src="./assets/images/no-results.png" className='img-fluid' alt="" /></div>
        <div className="col-md-6">
          <h3 className="text-left">
            {i18n(KeyWordLocalization.NoResultsComponentMiniTitle)}
          </h3>
          <h1 className="text_yellow text_bold text-justify" style={{fontSize: '3.7rem'}}>
            {i18n(KeyWordLocalization.NoResultsComponentTitle)}
          </h1>
          <h4 className="text-end">
            {i18n(KeyWordLocalization.NoResultsComponentDescription)}
          </h4>
        </div>
      </div>
    </div>
  </div>
}

export default NotResultsComponent;
