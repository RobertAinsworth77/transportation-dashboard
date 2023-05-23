import { FC, useEffect, useState } from 'react';
import './AutoCompleteStyles.scss';
import AutoCompleteProps from './AutoCompleteComponentProps';
import { Typeahead } from 'react-bootstrap-typeahead';
import { ErrorMessage } from '@hookform/error-message';
import Validators from '../../../utils/Validators';

const AutoCompleteComponent: FC<AutoCompleteProps> = ({ errors, keyName, label, register, options, onChange, watch, onSearch, required, disabled }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const selected = watch(keyName);

  let _timerTap: any;
  const _handleChangeText = (data: string) => {
    clearTimeout(_timerTap);
    setIsLoading(true);
    _timerTap = setTimeout(() => _handleSearch(data), 2000);
  }

  const _handleSearch = async (word: string) => {
    await onSearch(word);
    setIsLoading(false);
  }

  const _handlePickOption = (data: any) => {
    console.log('picked autocomplete', keyName, data);
    onChange(keyName, data?.[0]?.id ?? undefined);
  }

  const _hancleChangeSelected = async () => {
    if (selected?.id == undefined) {
      await _handleSearch("");
    }
    else {
      const option = options.filter((option) => option.id.id == selected.id);
      if (option.length == 0) {
        console.log('trata de ;lamar');
        await _handleSearch(selected.name);
        // console.log('selected asa', selected, 'options', options);
        // _handlePickOption(options.filter((option) => option.id.id == selected.id));
      }
    }
  }

  useEffect(() => {
    _hancleChangeSelected();
  }, [selected]);

  useEffect(() => {
  }, []);

  return <div className={`form-group autocomplete_component ${errors[keyName] ? 'error' : ''}`}>
    <label>{label}</label>
    <Typeahead options={options}
      disabled={disabled}
      onInputChange={_handleChangeText}
      onChange={_handlePickOption}
      id="type-ahead-add-driver"
      placeholder={label}
      selected={options.filter((option) => selected != undefined ? option.id.id == selected.id : false)}
      isLoading={isLoading} />
    <input type="hidden"  {...register(keyName, Validators({ required: required }))} />
    <ErrorMessage as="aside" errors={errors} name={keyName} />
  </div>

};

AutoCompleteComponent.defaultProps = {
  required: false,
  disabled: false,
}

export default AutoCompleteComponent;
