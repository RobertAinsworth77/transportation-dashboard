import './AddBusModalStyles.scss';
import { FC, useContext, useEffect, useState } from 'react';
import DependencyInjectionContext from '../../../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../../../di/provider/DependencyInjectionContextType';
import BusEntity from '../../../../../domain/entities/BusEntity';
import LanguageContext from '../../../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../../../domain/providers/language/LanguageContextType';
import { useForm } from 'react-hook-form';
import Validators from '../../../../utils/Validators';
import { ErrorMessage } from '@hookform/error-message';
import ModalsContext from '../../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../../domain/providers/modal/ModalsContextType';
import AddBusModalComponentProps from './AddBusModalComponentProps';
import KeyWordLocalization from '../../../../../domain/providers/language/dictionaries/KeyWordLocalization';

const AddBusModalComponent: FC<AddBusModalComponentProps> = ({ bus, done }) => {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { closeModalCustom, addToast } = useContext(ModalsContext) as ModalsContextType;
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();


  const _handleEdit = async (data: any) => {
    const tempBus: BusEntity = {
      ...data,
      id: bus?.id,
      year: Number(data.year),
      capacity: Number(data.capacity),
    }
    console.log('tempBus', tempBus);
    try {
      await di.useCases.updateBusUseCase.call(tempBus);
      closeModalCustom();
      addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
    } catch (error) {
      addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
    }
    done();
  }

  const _handleAdd = async (data: any) => {
    const tempBus: BusEntity = {
      ...data,
      year: Number(data.year),
      capacity: Number(data.capacity),
    }
    try {
      await di.useCases.createBusUseCase.call(tempBus);
      closeModalCustom();
      addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
    } catch (error) {
      addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
    }
    done();
  }

  const _handleChangeUser = () => {
    if (bus == undefined) return;
    Object.entries(bus).forEach(([key, value]) => {
      setValue(key, value);
    });
  }

  useEffect(() => {
    _handleChangeUser();
  }, [bus]);

  return <div className="add_bus_modal_component">
    <form onSubmit={handleSubmit(bus == undefined ? _handleAdd : _handleEdit)}>
      <div className="row">
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.plate ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.BusEntityPlate)}</label>
          <input type="text" className="form-control" placeholder={i18n(KeyWordLocalization.BusEntityPlate)}
            {...register('plate', Validators({ required: true }))} />
          <ErrorMessage as="aside" errors={errors} name="plate" />
        </div>
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.capacity ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.BusEntityCapacity)}</label>
          <input type="number" className="form-control" placeholder={i18n(KeyWordLocalization.BusEntityCapacity)}
            {...register('capacity', Validators({ required: true }))} />
          <ErrorMessage as="aside" errors={errors} name="capacity" />
        </div>
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.company ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.BusEntityCompany)}</label>
          <input type="text" className="form-control" placeholder={i18n(KeyWordLocalization.BusEntityCompany)}
            {...register('company', Validators({ required: true }))} />
          <ErrorMessage as="aside" errors={errors} name="company" />
        </div>
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.vehicleType ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.BusEntityVehicleType)}</label>
          <input type="text" className="form-control" placeholder={i18n(KeyWordLocalization.BusEntityVehicleType)}
            {...register('vehicleType', Validators({ required: true }))} />
          <ErrorMessage as="aside" errors={errors} name="vehicleType" />
        </div>
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.year ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.BusEntityYear)}</label>
          <input type="number" className="form-control" placeholder={i18n(KeyWordLocalization.BusEntityYear)}
            {...register('year', Validators({ required: true }))} />
          <ErrorMessage as="aside" errors={errors} name="year" />
        </div>
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.model ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.BusEntityModel)}</label>
          <input type="text" className="form-control" placeholder={i18n(KeyWordLocalization.BusEntityModel)}
            {...register('model', Validators({ required: true }))} />
          <ErrorMessage as="aside" errors={errors} name="model" />
        </div>
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.brand ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.BusEntityBrand)}</label>
          <input type="text" className="form-control" placeholder={i18n(KeyWordLocalization.BusEntityBrand)}
            {...register('brand', Validators({ required: true }))} />
          <ErrorMessage as="aside" errors={errors} name="brand" />
        </div>
      </div>
      <div className="d-flex justify-content-center justify-content-md-end">
        <button className="col-12 col-lg-4 btn btn-primary my-2" type='submit'>
          {i18n(bus != undefined ? KeyWordLocalization.Edit : KeyWordLocalization.Create)}
        </button>
      </div>
    </form >
  </div >
};

AddBusModalComponent.defaultProps = {
  bus: undefined
}

export default AddBusModalComponent;
