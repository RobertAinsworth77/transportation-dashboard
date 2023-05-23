import React, { useEffect } from 'react';
import LanguageEntity from '../../../domain/entities/LanguageEntity';
import ProviderProps from '../../../domain/providers/ProviderProps';
import LanguageContext from '../../../domain/providers/language/LanguageContext';
import LanguageList from '../../../domain/providers/language/dictionaries/LanguageList';

const keyNameLocalLanguage = "language_selected";
const LanguageProviderImpl: React.FC<ProviderProps> = ({ children }) => {
    const [language, setLanguage] = React.useState<LanguageEntity>(LanguageList[0]);
    const [languages, setLanguages] = React.useState<LanguageEntity[]>(LanguageList);
    const i18n = (keyword: string, values: any = null) => {
        if (values == null) return language.dictionary[keyword] ?? keyword;
        let result = language.dictionary[keyword] ?? keyword;
        Object.keys(values).forEach((key) => {
            result = result.replace(`{${key}}`, values[key]);
        }
        );
        return result;
    };

    const _readDefault = () => {
        const defaultLanguage = window.localStorage.getItem(keyNameLocalLanguage);
        if (defaultLanguage != null && defaultLanguage != '') {
            const findedLanguage = LanguageList.find((language) => language.code == defaultLanguage);
            setLanguage(findedLanguage ?? LanguageList[0]);
        }
    }

    useEffect(() => {
        _readDefault();
    }, []);
    return <LanguageContext.Provider value={{ i18n, language, setLanguage, languages, setLanguages }}>{children}</LanguageContext.Provider>;
}

export default LanguageProviderImpl;