import LanguageEntity from '../../../entities/LanguageEntity';
import en from './en.json';
import es from './es.json';

const LanguageList: LanguageEntity[] = [
    {
        name: 'english',
        code: 'en',
        dictionary: en
    },
    {
        name: 'español',
        code: 'es',
        dictionary: es
    }
];

export default LanguageList;