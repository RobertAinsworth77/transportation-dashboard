import { useContext } from "react";
import LanguageContextType from "../../domain/providers/language/LanguageContextType";
import LanguageContext from "../../domain/providers/language/LanguageContext";
import KeyWordLocalization from "../../domain/providers/language/dictionaries/KeyWordLocalization";

interface props {
    required?: boolean | undefined,
    email?: boolean | undefined,
    minLength?: number | undefined,
    maxLength?: number | undefined,
    minValue?: number | undefined,
    maxValue?: number | undefined,
    mustBeNumber?: boolean | undefined,
    specialCharacterRequired?: boolean | undefined,
    uppercaseRequired?: boolean | undefined,
    lowercaseRequired?: boolean | undefined,
    numberRequired?: boolean | undefined,
    mustBeEqual?: string | undefined,
    noSpecialCharacter?: boolean | undefined,
    noUpperCase?: boolean | undefined,
    noLowerCase?: boolean | undefined,
    noNumber?: boolean | undefined,
    name?: boolean | undefined,
    phone?: boolean | undefined,
    isPassword?: boolean | undefined,
    pattern?: {
        pattern: RegExp,
        message: string
    } | undefined,
    validate?: Function | undefined
    onChange?: Function | undefined
}

const Validators = (_: props): any => {
    const { i18n } = useContext(LanguageContext) as LanguageContextType;
    const { required, minLength, maxLength, pattern, validate, email, onChange, minValue, maxValue, mustBeNumber, specialCharacterRequired, uppercaseRequired, lowercaseRequired, numberRequired, mustBeEqual, noSpecialCharacter, noUpperCase, noLowerCase, noNumber, name, phone, isPassword } = _;
    let validator = {};
    let validateInside = {};

    if (required) {
        validator = { ...validator, required: i18n(KeyWordLocalization.ValidatorRequired) };
    }

    if (email) {
        validateInside = {
            ...validateInside,
            email: (value: string) => value.match(/^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+/g) ? null : i18n(KeyWordLocalization.ValidatorEmail),
        };
    }

    if (minLength) {
        validator = {
            ...validator, minLength: {
                value: minLength,
                message: i18n(KeyWordLocalization.ValidatorMinLength, { minLength: minLength })
            }
        };
    }

    if (maxLength) {
        validator = {
            ...validator, maxLength: {
                value: maxLength,
                message: i18n(KeyWordLocalization.ValidatorMaxLength, { maxLength: maxLength })
            }
        };
    }

    if (minValue) {
        validator = {
            ...validator, min: {
                value: minValue,
                message: i18n(KeyWordLocalization.ValidatorMinValue, { min: minValue })
            }
        };
    }

    if (maxValue) {
        validator = {
            ...validator, max: {
                value: maxValue,
                message: i18n(KeyWordLocalization.ValidatorMaxValue, { max: maxValue })
            }
        };
    }

    if (mustBeNumber) {
        validateInside = {
            ...validateInside,
            mustBeNumber: (value: string) => value.match(/(?=.*[0-9])/g) ? null : i18n(KeyWordLocalization.ValidatorMustBeNumber),
        };
    }

    if (specialCharacterRequired || isPassword) {
        validateInside = {
            ...validateInside,
            specialCharacterRequired: (value: string) => value.match(/(?=.*[\^$*.[\]{}()?"!@#%&/\\,><'+r':;|_~`=+\- ])/g) ? null : i18n(KeyWordLocalization.ValidatorSpecialCharactersIsRequired),
        };
    }

    if (uppercaseRequired || isPassword) {
        validateInside = {
            ...validateInside,
            uppercaseRequired: (value: string) => value.match(/(?=.*[A-Z])/g) ? null : i18n(KeyWordLocalization.ValidatorUpperCaseIsRequired),
        };
    }

    if (lowercaseRequired || isPassword) {
        validateInside = {
            ...validateInside,
            lowercaseRequired: (value: string) => value.match(/(?=.*[a-z])/g) ? null : i18n(KeyWordLocalization.ValidatorLowerCaseIsRequired),
        };
    }

    if (numberRequired || isPassword) {
        validateInside = {
            ...validateInside,
            numberRequired: (value: string) => value.match(/(?=.*[0-9])/g) ? null : i18n(KeyWordLocalization.ValidatorNumberIsRequired),
        };
    }

    if (noSpecialCharacter || name) {
        validateInside = {
            ...validateInside,
            noSpecialCharacter: (value: string) => !value.match(/^((?![\{}()?"!@#%&/\\,.:;|_~`=+$\><]).)*$/g) ? i18n(KeyWordLocalization.VaidatorSpecialCharacterIsNotAllowed) : null,
        };
    }

    if (noUpperCase) {
        validateInside = {
            ...validateInside,
            noUpperCase: (value: string) => value.match(/^((?![A-Z]).)*$/g) ? i18n(KeyWordLocalization.ValidatorUpperCaseIsNotAllowed) : null,
        };
    }

    if (noLowerCase) {
        validateInside = {
            ...validateInside,
            noLowerCase: (value: string) => value.match(/^((?![a-z]).)*$/g) ? i18n(KeyWordLocalization.ValidatorLowerCaseIsNotAllowed) : null,
        };
    }

    if (noNumber || name) {
        validateInside = {
            ...validateInside,
            noNumber: (value: string) => /\d/.test(value) ? i18n(KeyWordLocalization.ValidatorNumberIsNotAllowed) : null,
        };
    }


    if (mustBeEqual) {
        validateInside = {
            ...validateInside,
            mustBeEqual: (value: string) => value === mustBeEqual ? null : i18n(KeyWordLocalization.ValidatorMustBeEqual, { mustBeEqual: mustBeEqual }),
        };
    }

    if (phone) {
        validator = {
            ...validator, minLength: {
                value: 5,
                message: i18n(KeyWordLocalization.ValidatorMinLength, { minLength: 5 })
            }
        };

        validator = {
            ...validator, maxLength: {
                value: 13,
                message: i18n(KeyWordLocalization.ValidatorMaxLength, { maxLength: 13 })
            }
        };

        validateInside = {
            ...validateInside,
            phone: (value: string) => value.match(/^(?:[0-9] ?){5,13}[0-9]$/g) ? null : i18n(KeyWordLocalization.ValidatorIsNotPhone),
        };
    }

    if (isPassword) {
        validator = {
            ...validator, minLength: {
                value: 6,
                message: i18n(KeyWordLocalization.ValidatorMinLength, { minLength: 6 })
            }
        };

        validator = {
            ...validator, maxLength: {
                value: 20,
                message: i18n(KeyWordLocalization.ValidatorMaxLength, { maxLength: 20 })
            }
        };
    }

    if (pattern) {
        validator = { ...validator, pattern: {
            value: pattern.pattern,
            message: pattern.message,
        } };
    }

    if (validate) {
        validateInside = { ...validateInside, validate: validate };
    }

    if (onChange) {
        validator = { ...validator, onChange: onChange };
    }

    validator = { ...validator, validate: validateInside };
    return validator;
}

Validators.defaultProps = {
    required: undefined,
    email: undefined,
    minValue: undefined,
    maxValue: undefined,
    mustBeNumber: undefined,
    specialCharacterRequired: undefined,
    uppercaseRequired: undefined,
    lowercaseRequired: undefined,
    numberRequired: undefined,
    noSpecialCharacter: undefined,
    noUpperCase: undefined,
    noLowerCase: undefined,
    noNumber: undefined,
    mustBeEqual: undefined,
    phone: undefined,
    isPassword: undefined,
    name: undefined,
    minLength: undefined,
    maxLength: undefined,
    pattern: undefined,
    validate: undefined,
    onChange: undefined,
};

export default Validators;