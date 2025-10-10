import { FC, useEffect, useState } from 'react';
import './AutoCompleteStyles.scss';
import AutoCompleteProps from './AutoCompleteComponentProps';
import { Typeahead } from 'react-bootstrap-typeahead';
import { ErrorMessage } from '@hookform/error-message';
import Validators from '../../../utils/Validators';

const AutoCompleteComponent: FC<AutoCompleteProps> = ({ errors, keyName, label, register, options, onChange, watch, onSearch, required, disabled }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAllOptions, setShowAllOptions] = useState<boolean>(false);
  const selected = watch(keyName);

  let _timerTap: any;
  const _handleChangeText = (data: string) => {
    clearTimeout(_timerTap);
    setIsLoading(true);
    // If user clears the field or types very little, show all options
    if (data.length <= 2) {
      _timerTap = setTimeout(() => _handleSearch(""), 100);
    } else {
      // Only filter when user types 3+ characters
      _timerTap = setTimeout(() => _handleSearch(data), 300);
    }
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
    // Always load all options initially
    setIsLoading(true);
    await _handleSearch("");
    setIsLoading(false);
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
      onFocus={() => {
        // Show all options when user clicks/focuses the field
        console.log('🔍 AutoComplete focused, showing all options');
        setShowAllOptions(true);
        setIsLoading(true);
        _handleSearch("").then(() => setIsLoading(false));
      }}
      onBlur={() => {
        // Reset filtering when user leaves the field
        setShowAllOptions(false);
      }}
      filterBy={(option: any, props: any) => {
        // When showAllOptions is true, don't filter anything
        if (showAllOptions) {
          return true;
        }
        // Default filtering behavior - handle both string and object options
        const optionText = typeof option === 'string' ? option : option.label || '';
        return optionText.toLowerCase().includes(props.text.toLowerCase());
      }}
      id={`type-ahead-${keyName}`}
      placeholder={label}
      selected={options.filter((option) => selected != undefined ? option.id.id == selected.id : false)}
      isLoading={isLoading}
      minLength={0}
      defaultOpen={false}
      allowNew={false} />
    <input type="hidden"  {...register(keyName, Validators({ required: required }))} />
    <ErrorMessage as="aside" errors={errors} name={keyName} />
  </div>

};

AutoCompleteComponent.defaultProps = {
  required: false,
  disabled: false,
}

export default AutoCompleteComponent;
