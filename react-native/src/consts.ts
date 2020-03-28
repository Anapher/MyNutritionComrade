import { ConsumptionTime } from 'Models';

export const TagLiquid = 'liquid';
export const CurrentLanguage = 'de';

type LanguageInfo = {
    twoLetterCode: string;
    name: string;
};
export const SupportedLanguages: LanguageInfo[] = [
    { name: 'English', twoLetterCode: 'en' },
    { name: 'German', twoLetterCode: 'de' },
    { name: 'French', twoLetterCode: 'fr' },
];

export const errorColor = '#e74c3c';

export const ConsumptionTimes: ConsumptionTime[] = ['breakfast', 'lunch', 'dinner', 'snack'];
