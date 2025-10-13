import './AddRouteAlignmentModalStyles.scss';
import { FC, useContext, useEffect, useState } from 'react';
import DependencyInjectionContext from '../../../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../../../di/provider/DependencyInjectionContextType';
import RouteAlignmentEntity from '../../../../../domain/entities/RouteAlignmentEntity';
import LanguageContext from '../../../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../../../domain/providers/language/LanguageContextType';
import { useForm } from 'react-hook-form';
import Validators from '../../../../utils/Validators';
import { ErrorMessage } from '@hookform/error-message';
import ModalsContext from '../../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../../domain/providers/modal/ModalsContextType';
import AddRouteAlignmentModalComponentProps from './AddRouteAlignmentModalComponentProps';
import KeyWordLocalization from '../../../../../domain/providers/language/dictionaries/KeyWordLocalization';

const AddRouteAlignmentModalComponent: FC<AddRouteAlignmentModalComponentProps> = ({ routeAlignment, done }) => {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { closeModalCustom, addToast } = useContext(ModalsContext) as ModalsContextType;
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const [countries, setCountries] = useState<string[]>(['St. Lucia', 'Jamaica', 'Honduras']);

  const _handleEdit = async (data: any) => {
    const tempRouteAlignment: RouteAlignmentEntity = {
      ...data,
      id: routeAlignment?.id,
    }
    try {
      await di.repositories.routeAlignmentRepository?.updateRouteAlignment(tempRouteAlignment);
      closeModalCustom();
      addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
    } catch (error) {
      addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
    }
    done();
  }

  const _handleAdd = async (data: any) => {
    const tempRouteAlignment: RouteAlignmentEntity = {
      ...data,
      id: 0,
    }
    try {
      await di.repositories.routeAlignmentRepository?.createRouteAlignment(tempRouteAlignment);
      closeModalCustom();
      addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
    } catch (error) {
      addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
    }
    done();
  }

  const _handleChangeRouteAlignment = () => {
    if (routeAlignment == undefined) return;
    Object.entries(routeAlignment).forEach(([key, value]) => {
      setValue(key, value);
    });
  }

  useEffect(() => {
    _handleChangeRouteAlignment();
  }, []);

  return <div className="add_route_alignment_modal_component">
    <form onSubmit={handleSubmit(routeAlignment == undefined ? _handleAdd : _handleEdit)}>
      <div className="row">
        <div className={`col-12 col-lg-4 my-2 form-group ${errors.country ? 'error' : ''}`}>
          <label>Country</label>
          <select className="form-control"
            {...register('country', Validators({ required: true }))} >
            <option value="">Select Country</option>
            {countries.map((country, index) => {
              return <option key={index} value={country}>{country}</option>
            })}
          </select>
          <ErrorMessage as="aside" errors={errors} name="country" />
        </div>
        <div className={`col-12 col-lg-4 my-2 form-group ${errors.city ? 'error' : ''}`}>
          <label>City</label>
          <input type="text" className="form-control" placeholder="City"
            {...register('city', Validators({ required: true }))} />
          <ErrorMessage as="aside" errors={errors} name="city" />
        </div>
        <div className={`col-12 col-lg-4 my-2 form-group ${errors.community ? 'error' : ''}`}>
          <label>Community</label>
          <input type="text" className="form-control" placeholder="Community"
            {...register('community', Validators({ required: true }))} />
          <ErrorMessage as="aside" errors={errors} name="community" />
        </div>
      </div>
      <div className="d-flex justify-content-center justify-content-md-end">
        <button className="col-12 col-lg-4 btn btn-primary my-2" type='submit'>
          {routeAlignment != undefined ? 'Edit' : 'Create'}
        </button>
      </div>
    </form >
  </div >
};

AddRouteAlignmentModalComponent.defaultProps = {
  routeAlignment: undefined
}

export default AddRouteAlignmentModalComponent;
