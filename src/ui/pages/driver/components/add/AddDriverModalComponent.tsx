import { FC, useContext, useEffect, useState } from 'react';
import DependencyInjectionContext from '../../../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../../../di/provider/DependencyInjectionContextType';
import DriverEntity from '../../../../../domain/entities/DriverEntity';
import KeyWordLocalization from '../../../../../domain/providers/language/dictionaries/KeyWordLocalization';
import LanguageContext from '../../../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../../../domain/providers/language/LanguageContextType';
import './AddDriverModalStyles.scss';
import AddDriverModalComponentProps from './AddDriverModalComponentProps';
import { useForm } from 'react-hook-form';
import Validators from '../../../../utils/Validators';
import { ErrorMessage } from '@hookform/error-message';
import BusEntity from '../../../../../domain/entities/BusEntity';
import AutoCompleteComponent from '../../../../components/form/autocomplete/AutoCompleteComponent';
import ModalsContext from '../../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../../domain/providers/modal/ModalsContextType';
import PhoneInput from 'react-phone-input-2';
import { COUNTRIES_CODE } from '../../../../utils/Constants';

const AddDriverModalComponent: FC<AddDriverModalComponentProps> = ({ driver, done }) => {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { closeModalCustom, addToast } = useContext(ModalsContext) as ModalsContextType;
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const [busses, setBusses] = useState<BusEntity[]>([]);

  const _handleEdit = async (data: any) => {
    data.enabled = data.enabled == "true";
    const tempUser: DriverEntity = {
      ...data,
      id: driver?.id,
    }
    console.log('data edit driver', tempUser)
    try {
      await di.useCases.updateDriverUseCase.call(tempUser);
      closeModalCustom();
      addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
    } catch (error) {
      addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
    }
    done();
  }

  const _handleAdd = async (data: any) => {
    data.enabled = data.enabled == "true";
    const tempUser: DriverEntity = {
      ...data,
      id: 0,
    }
    console.log('data edit driver', tempUser)
    try {
      await di.useCases.createDriverUseCase.call(tempUser, data.password);
      closeModalCustom();
      addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
      done();
    } catch (error) {
      addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
    }
  }

  const _handleChangeDriver = () => {
    if (driver == undefined) return;
    Object.entries(driver).forEach(([key, value]) => {
      setValue(key, value);
    });
  }

  // const searchBusses = async (plate: string) => {
  //   const response = await di.useCases.searchBusesByNameUseCase.call(plate);
  //   setBusses(response);
  // }

  useEffect(() => {
    _handleChangeDriver();
  }, [driver]);

  return <div className="add_driver_modal_component">
    <form onSubmit={handleSubmit(driver == undefined ? _handleAdd : _handleEdit)}>
      <div className="row">
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.name ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.DriverEntityName)}</label>
          <input type="text" className="form-control" placeholder={i18n(KeyWordLocalization.DriverEntityName)}
            {...register('name', Validators({ required: true, name:true, minLength: 2 }))} />
          <ErrorMessage as="aside" errors={errors} name="name" />
        </div>
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.email ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.DriverEntityEmail)}</label>
          <input type="email" className="form-control" placeholder={i18n(KeyWordLocalization.DriverEntityEmail)}
            disabled={driver != undefined}
            {...register('email', Validators(driver == undefined ? { required: true, email: true } : {}))} />
          <ErrorMessage as="aside" errors={errors} name="email" />
        </div>
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.enabled ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.DriverEntityEnabled)}</label>
          <select className="form-control"
            {...register('enabled', Validators({ required: true }))} >
            <option value="">{i18n(KeyWordLocalization.DriverEntityEnabled)}</option>
            <option value="true">{i18n(KeyWordLocalization.Yes)}</option>
            <option value="false">{i18n(KeyWordLocalization.No)}</option>
          </select>
          <ErrorMessage as="aside" errors={errors} name="enabled" />
        </div>
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.phone ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.DriverEntityPhone)}</label>
          <PhoneInput
            country={'us'}
            onlyCountries={COUNTRIES_CODE}
            value={watch('phone')}
            onChange={phone => setValue('phone', phone)}
          />
          <input type="hidden" className="form-control" placeholder={i18n(KeyWordLocalization.DriverEntityPhone)}
            {...register('phone', Validators({ required: true, phone: true }))} />
          <ErrorMessage as="aside" errors={errors} name="phone" />
        </div>

        {driver == undefined && < div className={`col-12 col-lg-6 my-2 form-group ${errors.password ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.Password)}</label>
          <input type="password" {...register("password", Validators({ required: true, minLength: 6 }))}
            className={`form-control ${errors.password ? 'error' : ''}`} placeholder={i18n(KeyWordLocalization.Password)} />
          <ErrorMessage as="aside" errors={errors} name="password" />
        </div>}

        {driver == undefined && < div className={`col-12 col-lg-6 my-2 form-group ${errors.confirm_password ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.PasswordConfirm)}</label>
          <input type="password" {...register("confirm_password", Validators({
            required: true, minLength: 6, validate: (val: string) => {
              if (watch('password') != val) {
                return i18n(KeyWordLocalization.PasswordsNotMatch);
              }
            },
          }))} className="form-control" placeholder={i18n(KeyWordLocalization.PasswordConfirm)} />
          <ErrorMessage as="aside" errors={errors} name="confirm_password" />
        </div>}
        {/* <div className="col-12 col-lg-6">
          <AutoCompleteComponent onSearch={searchBusses} errors={errors} label={i18n(KeyWordLocalization.DriverEntityDefaultBus)} keyName="defaultBus" onChange={setValue}
            register={register} watch={watch} options={busses.map((bus) => { return { label: bus.plate, id: bus } })} />
        </div> */}

      </div>
      <div className="d-flex justify-content-center justify-content-md-end">
        <button className="col-12 col-lg-4 btn btn-primary my-2" type='submit'>
          {i18n(driver != undefined ? KeyWordLocalization.Edit : KeyWordLocalization.Create)}
        </button>
      </div>
    </form >
  </div >
};

AddDriverModalComponent.defaultProps = {
  driver: undefined
}

export default AddDriverModalComponent;
