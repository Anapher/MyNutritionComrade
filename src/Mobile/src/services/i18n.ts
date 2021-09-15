import { ProductLabel, ProductLabelList } from 'src/types';
import i18next, { FormatFunction, LanguageDetectorModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../assets/en';
import { formatErrorMessage } from 'src/utils/error-utils';
import { locale } from 'expo-localization';
import { capitalizeFirstLetter } from 'src/utils/string-utils';
import { DateTime } from 'luxon';

const DEFAULT_LANG = 'en';

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

const formatInterpolation: FormatFunction = (value: any, format?: string, lng?: string) => {
   switch (format) {
      case 'error':
         return formatErrorMessage(value);
      case 'product':
         const label: ProductLabelList = value.label || value;
         if (lng && label[lng]) return label[lng].value;
         if (label[DEFAULT_LANG]) return label[DEFAULT_LANG].value;
         const allLabels = Object.values(label);
         return allLabels.length === 0 ? 'No label' : allLabels[0].value;
      case 'capitalizeFirstLetter':
         return capitalizeFirstLetter(value);
      case 'dateHuge':
         return DateTime.fromISO(value).toLocaleString(DateTime.DATE_HUGE);
      default:
         return value;
   }
};

i18next
   .use(initReactI18next)
   .use(languageDetector)
   .init({
      resources,
      fallbackLng: DEFAULT_LANG,
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
