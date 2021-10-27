import { AxiosError } from 'axios';
import { Alert } from 'react-native';
import i18next from 'src/services/i18n';
import { axiosErrorToString } from './error-utils';

export function showErrorAlert(error: any, title?: string) {
   let message = error.toString();
   const axiosError = error as AxiosError;
   if (axiosError.isAxiosError) {
      message = axiosErrorToString(axiosError);
   }

   Alert.alert(title || i18next.t('error_occurred'), message, [{ text: 'OK', style: 'cancel' }], { cancelable: true });
}
