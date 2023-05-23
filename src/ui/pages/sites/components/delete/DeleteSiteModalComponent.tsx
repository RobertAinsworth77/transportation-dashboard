import './DeleteSiteModalStyles.scss';
import { FC, useContext } from 'react';
import KeyWordLocalization from '../../../../../domain/providers/language/dictionaries/KeyWordLocalization';
import LanguageContext from '../../../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../../../domain/providers/language/LanguageContextType';
import { useForm } from 'react-hook-form';
import Validators from '../../../../utils/Validators';
import { ErrorMessage } from '@hookform/error-message';
import ModalsContext from '../../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../../domain/providers/modal/ModalsContextType';
import DeleteSiteModalComponentProps from './DeleteSiteModalComponentProps';

const DeleteSiteModalComponent: FC<DeleteSiteModalComponentProps> = ({ done }) => {
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { closeModalCustom } = useContext(ModalsContext) as ModalsContextType;

  const { register, handleSubmit, formState: { errors } } = useForm();

  const _handleDelete = (_: any) => {
    closeModalCustom();
    done();
  };

  return <div className="delete_site_modal_component">
    <form onSubmit={handleSubmit(_handleDelete)}>
      <div className="row">
        <div className={`col-12 form-group ${errors.confirm ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.DeleteSiteDescription)}</label>
          <input type="confirm" {...register("confirm", Validators({
            required: true, validate: (val: string) => {
              if (val != i18n(KeyWordLocalization.Confirm)) {
                return i18n(KeyWordLocalization.ConfirmNotMatch);
              }
            },
          }))} className="form-control my-2" placeholder={i18n(KeyWordLocalization.DeleteSitePlaceholder)} />
          <ErrorMessage as="aside" errors={errors} name="confirm" />
        </div>
        <div className="d-flex flex-md-row flex-column justify-content-center justify-content-md-end">

          <button className="col-lg-4 btn btn-light m-md-2" type='button' onClick={closeModalCustom}>
            {i18n(KeyWordLocalization.Cancel)}
          </button>
          <button className="col-12 col-lg-4 btn btn-danger my-2" type='submit'>
            {i18n(KeyWordLocalization.Confirm)}
          </button>
        </div>
      </div>
    </form >
  </div >
};

export default DeleteSiteModalComponent;
