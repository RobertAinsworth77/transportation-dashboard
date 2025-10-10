import './DeleteTripModalStyles.scss';
import { FC, useContext } from 'react';
import KeyWordLocalization from '../../../../domain/providers/language/dictionaries/KeyWordLocalization';
import LanguageContext from '../../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../../domain/providers/language/LanguageContextType';
import { useForm } from 'react-hook-form';
import Validators from '../../../utils/Validators';
import { ErrorMessage } from '@hookform/error-message';
import ModalsContext from '../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../domain/providers/modal/ModalsContextType';
import DeleteTripModalComponentProps from './DeleteTripModalComponentProps';

const DeleteTripModalComponent: FC<DeleteTripModalComponentProps> = ({ done }) => {
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { closeModalCustom } = useContext(ModalsContext) as ModalsContextType;

  const _handleDelete = () => done();

  return <div className="delete_trip_modal_component">
    <div className="row">
      <div className="col-12 mb-4">
        <p>{i18n(KeyWordLocalization.DeleteTripDescription)}</p>
      </div>
      <div className="d-flex flex-md-row flex-column justify-content-center justify-content-md-end">
        <button className="col-lg-4 btn btn-light m-md-2" type='button' onClick={closeModalCustom}>
          {i18n(KeyWordLocalization.Cancel)}
        </button>
        <button className="col-12 col-lg-4 btn btn-danger my-2" type='button' onClick={_handleDelete}>
          {i18n(KeyWordLocalization.Delete)}
        </button>
      </div>
    </div>
  </div >
};

export default DeleteTripModalComponent;
