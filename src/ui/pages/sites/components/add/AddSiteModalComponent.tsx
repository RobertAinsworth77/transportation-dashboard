import './AddSiteModalStyles.scss';
import { FC, useContext, useEffect, useState } from 'react';
import DependencyInjectionContext from '../../../../../di/provider/DependencyInjectionContext';
import DependencyInjectionContextType from '../../../../../di/provider/DependencyInjectionContextType';
import SiteEntity from '../../../../../domain/entities/SiteEntity';
import LanguageContext from '../../../../../domain/providers/language/LanguageContext';
import LanguageContextType from '../../../../../domain/providers/language/LanguageContextType';
import { useForm } from 'react-hook-form';
import Validators from '../../../../utils/Validators';
import { ErrorMessage } from '@hookform/error-message';
import ModalsContext from '../../../../../domain/providers/modal/ModalsContext';
import ModalsContextType from '../../../../../domain/providers/modal/ModalsContextType';
import AddSiteModalComponentProps from './AddSiteModalComponentProps';
import KeyWordLocalization from '../../../../../domain/providers/language/dictionaries/KeyWordLocalization';

const AddSiteModalComponent: FC<AddSiteModalComponentProps> = ({ site, done }) => {
  const { di } = useContext(DependencyInjectionContext) as DependencyInjectionContextType;
  const { i18n } = useContext(LanguageContext) as LanguageContextType;
  const { closeModalCustom, addToast } = useContext(ModalsContext) as ModalsContextType;
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const [countries, setCountries] = useState<string[]>([]);

  const _handleEdit = async (data: any) => {
    const tempSite: SiteEntity = {
      ...data,
      id: site?.id,
    }
    console.log('tempSite', tempSite);
    try {
      await di.useCases.updateSiteUseCase.call(tempSite);
      closeModalCustom();
      addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
    } catch (error) {
      addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
    }
    done();
  }

  const _handleAdd = async (data: any) => {
    const tempSite: SiteEntity = {
      ...data,
      id: 0,
    }
    try {
      await di.useCases.createSiteUseCase.call(tempSite);
      closeModalCustom();
      addToast(i18n(KeyWordLocalization.SavedSuccessfully), 'success', null);
    } catch (error) {
      addToast(i18n(KeyWordLocalization.ErrorSaving), 'error', null);
    }
    done();
  }

  const _handleChangeSite = () => {
    if (site == undefined) return;
    Object.entries(site).forEach(([key, value]) => {
      console.log(key, value);
      setValue(key, value);
    });
  }

  const _getCountries = async () => {
    const countries = await di.useCases.getCountriesOfSitesUseCase.call();
    setCountries(countries);
  }

  useEffect(() => {
    if(countries.length > 0) _handleChangeSite();
  }, [countries]);

  useEffect(() => {
    _getCountries();
  }, []);

  return <div className="add_site_modal_component">
    <form onSubmit={handleSubmit(site == undefined ? _handleAdd : _handleEdit)}>
      <div className="row">
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.name ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.SiteEntityName)}</label>
          <input type="text" className="form-control" placeholder={i18n(KeyWordLocalization.SiteEntityName)}
            {...register('name', Validators({ required: true }))} />
          <ErrorMessage as="aside" errors={errors} name="name" />
        </div>
        <div className={`col-12 col-lg-6 my-2 form-group ${errors.country ? 'error' : ''}`}>
          <label>{i18n(KeyWordLocalization.SiteEntityCountry)}</label>
          <select className="form-control"
            {...register('country', Validators({ required: true }))} >
            <option value="">{i18n(KeyWordLocalization.SiteEntityCountry)}</option>
            {countries.map((country, index) => {
              return <option key={index} value={country}>{country}</option>
            })}
          </select>
          <ErrorMessage as="aside" errors={errors} name="country" />
        </div>
      </div>
      <div className="d-flex justify-content-center justify-content-md-end">
        <button className="col-12 col-lg-4 btn btn-primary my-2" type='submit'>
          {i18n(site != undefined ? KeyWordLocalization.Edit : KeyWordLocalization.Create)}
        </button>
      </div>
    </form >
  </div >
};

AddSiteModalComponent.defaultProps = {
  site: undefined
}

export default AddSiteModalComponent;
