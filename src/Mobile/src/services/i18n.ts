import i18next, { FormatFunction, LanguageDetectorModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../assets/en';
import { formatErrorMessage } from 'src/utils/error-utils';
import { locale } from 'expo-localization';

const languageDetector: LanguageDetectorModule = {
   type: 'languageDetector',
   detect: () => locale,
   init: () => {},
   cacheUserLanguage: () => {},
};

type LanguageInfo = {
   id: string;
   name: string;
};

const resources = {
   en,
};

export const supportedLanguages: LanguageInfo[] = [
   { id: 'en', name: 'English' },
   { id: 'de', name: 'Deutsch' },
];

const formatInterpolation: FormatFunction = (value: any, format?: string) => {
   switch (format) {
      case 'error':
         return formatErrorMessage(value);
      default:
         return value;
   }
};

i18next
   .use(initReactI18next)
   .use(languageDetector)
   .init({
      resources,
      fallbackLng: 'en',
      supportedLngs: supportedLanguages.map((x) => x.id),
      ns: ['common', 'main'],
      defaultNS: 'main',
      nonExplicitSupportedLngs: true,
      interpolation: {
         escapeValue: false,
         format: formatInterpolation,
      },
   });

export default i18next;
