import './AddUserModalStyles.scss';
import { FC, useContext, useEffect, useState } from 'react';
import DependencyInjectionContext from '../../../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../../../di/provider/DependencyInjectionContextType';
import UserEntity, { UserEntityRole } from '../../../../../domain/entities/UserEntity';
import LanguageContext from '../../../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../../../domain/providers/language/LanguageContextType';
import AddUserModalComponentProps from './AddUserModalComponentProps';
import { useForm } from 'react-hook-form';
import Validators from '../../../../utils/Validators';
import { ErrorMessage } from '@hookform/error-message';
import ModalsContext from '../../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../../domain/providers/modal/ModalsContextType';
import KeyWordLocalization from '../../../../../domain/providers/language/dictionaries/KeyWordLocalization';
import UserContext from '../../../../../domain/providers/user/UserContext';
import UserContextType from '../../../../../domain/providers/user/UserContextType';
import PhoneInput from 'react-phone-input-2';
import { COUNTRIES_CODE } from '../../../../utils/Constants';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const AddUserModalComponent: FC<AddUserModalComponentProps> = ({ userEditing, done }) => {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { user } = useContext(UserContext) as UserContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { closeModalCustom, addToast } = useContext(ModalsContext) as ModalsContextType;
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const _handleEdit = async (data: any) => {
    const tempUser: UserEntity = {
      ...data,
      id: userEditing?.id,
    }
    try {
      await di.useCases.updateUserUseCase.call(tempUser);
      closeModalCustom();
      addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
    } catch (error) {
      addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
    }
    done();
  }

  const _handleAdd = async (data: any) => {
    const tempUser: UserEntity = {
      ...data,
      id: 0,
    }
    try {
      await di.useCases.createUserUseCase.call(tempUser, data.password);
      closeModalCustom();
      addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
      done();
    } catch (error: any) {
      addToast(i18n(error), 'error', null);
    }
  }

  const _handleChangeUser = () => {
    if (userEditing == undefined) return;
    Object.entries(userEditing).forEach(([key, value]) => {
      setValue(key, value);
    });
  }

  const _handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    _handleChangeUser();
  }, [userEditing]);

  return <div className="add_user_modal_component">
    <form onSubmit={handleSubmit(userEditing == undefined ? _handleAdd : _handleEdit)}>
      <div className="row">
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.name ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.UserEntityName)}</label>
          <input type="text" className="form-control" placeholder={i18n(KeyWordLocalization.UserEntityName)}
            {...register('name', Validators({ required: true, name: true, minLength: 2 }))} />
          <ErrorMessage as="aside" errors={errors} name="name" />
        </div>
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.email ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.UserEntityEmail)}</label>
          <input type="email" className="form-control" placeholder={i18n(KeyWordLocalization.UserEntityEmail)}
            disabled={userEditing != undefined}
            {...register('email', Validators(userEditing == undefined ? { required: true, email: true } : {}))} />
          <ErrorMessage as="aside" errors={errors} name="email" />
        </div>
        <input type='hidden' {...register('role')} value={UserEntityRole.admin} />
        {/* <div className={`col-12 col-lg-6 my-2 form-group ${errors.role ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.UserEntityRole)}</label>
          <select className="form-control" defaultValue={UserEntityRole.admin}
            disabled={user?.role != UserEntityRole.admin}
            {...register('role', Validators({ required: true }))} >
            <option value="">{i18n(KeyWordLocalization.UserEntityRole)}</option>
            <option value={UserEntityRole.normal}>{UserEntityRole.normal}</option> 
            <option value={UserEntityRole.admin}>{UserEntityRole.admin}</option>
          </select>
          <ErrorMessage as="aside" errors={errors} name="role" />
        </div> */}
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.phone ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.UserEntityPhone)}</label>
          <PhoneInput
            country={'us'}
            onlyCountries={COUNTRIES_CODE}
            value={watch('phone')}
            onChange={phone => setValue('phone', phone)}
          />
          <input type="hidden" className="form-control" placeholder={i18n(KeyWordLocalization.UserEntityPhone)}
            {...register('phone', Validators({ phone: true }))} />
          <ErrorMessage as="aside" errors={errors} name="phone" />
        </div>

        {userEditing == undefined &&
          <div className={`col-12 col-lg-6 my-2 form-group ${errors.password ? 'error' : ''}`}>
            <label>{i18n(KeyWordLocalization.Password)}</label>
            <div className="password_input_wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', Validators({ required: true, isPassword: true }))}
                className={`form-control ${errors.password ? 'error' : ''}`}
                placeholder={i18n(KeyWordLocalization.Password)}
              />
              <div className='visibility_icon' onClick={_handleTogglePasswordVisibility}>
                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
              </div>
            </div>
            <ErrorMessage as="aside" errors={errors} name="password" />
          </div>
        }

        {userEditing === undefined && (
          <div className={`col-12 col-lg-6 my-2 form-group ${errors.confirm_password ? 'error' : ''}`}>
            <label>{i18n(KeyWordLocalization.PasswordConfirm)}</label>
            <div className="password_input_wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register("confirm_password", Validators({
                  required: true,
                  isPassword: true,
                  validate: (val: string) => {
                    if (watch('password') !== val) {
                      return i18n(KeyWordLocalization.PasswordsNotMatch);
                    }
                  },
                }))}
                className="form-control"
                placeholder={i18n(KeyWordLocalization.PasswordConfirm)}
              />
              <div className="visibility_icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
              </div>
            </div>
            <ErrorMessage as="aside" errors={errors} name="confirm_password" />
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center justify-content-md-end">
        <button className="col-12 col-lg-4 btn btn-primary my-2" type='submit'>
          {i18n(userEditing != undefined ? KeyWordLocalization.Edit : KeyWordLocalization.Create)}
        </button>
      </div>
    </form >
  </div >
};

AddUserModalComponent.defaultProps = {
  userEditing: undefined
}

export default AddUserModalComponent;
