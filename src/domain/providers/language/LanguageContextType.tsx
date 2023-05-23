import LanguageEntity from "../../entities/LanguageEntity";

type LanguageContextType = {
  languages: LanguageEntity[];
  language: LanguageEntity | undefined;
  i18n: (keyWord: string, values?: any) => string;
  setLanguage: (language: LanguageEntity) => void;
  setLanguages: (language: LanguageEntity[]) => void;
};


export default LanguageContextType;