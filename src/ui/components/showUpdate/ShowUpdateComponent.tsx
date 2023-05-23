import { FC, useContext } from 'react';
import './ShowUpdateStyles.scss';
import ShowUpdateComponentProps from './ShowUpdateComponentProps';
import LanguageContextType from '../../../domain/providers/language/LanguageContextType';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import KeyWordLocalization from '../../../domain/providers/language/dictionaries/KeyWordLocalization';
import DependencyInjectionContext from '../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../di/provider/DependencyInjectionContextType';

const ShowUpdateComponent: FC<ShowUpdateComponentProps> = ({ onClose, showClose }) => {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;

  const _handleUpdate = () => {
    di.useCases.downloadLastVersionUseCase.call();
  }

  const _handleRemindmeLater = () => {
    di.useCases.remindMeLaterUpdateUseCase.call();
    onClose();
  }

  return <div className="show_update_component  d-flex align-items-center">
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6"><img src="./assets/images/update-available.png" className='img-fluid' alt="" /></div>
        <div className="col-md-6 d-flex align-items-center">
          <div className="">
            <h3 className="text-left">
              {i18n(KeyWordLocalization.ShowUpdateComponentMiniTitle)}
            </h3>
            <h1 className="text_yellow text_bold text-justify" style={{ fontSize: '3.7rem' }}>
              {i18n(KeyWordLocalization.ShowUpdateComponentTitle)}
            </h1>
            <h4 className="text-end">
              {i18n(KeyWordLocalization.ShowUpdateComponentDescription)}
            </h4>
            <div className="d-flex justify-content-end px-3 mt-3">
              <div onClick={_handleUpdate} className="btn btn_primary">{i18n(KeyWordLocalization.ShowUpdateComponentDownloadNow)}</div>
            </div>
            {showClose &&
              <div className="d-flex justify-content-end px-3 mt-3">
                <div onClick={_handleRemindmeLater} className="btn btn-light">{i18n(KeyWordLocalization.ShowUpdateComponentRemindMeLater)}</div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default ShowUpdateComponent;
