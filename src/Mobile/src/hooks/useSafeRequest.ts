import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AxiosError } from 'axios';
import { useSelector } from 'react-redux';
import { selectAuthInfo } from 'src/features/settings/selectors';
import { RootNavigatorParamList } from 'src/RootNavigator';

export type SafeRequestMethod = {
   authenticated: boolean;
   makeSafeRequest: <T>(requestHandler: () => Promise<T>, authRequired?: boolean) => Promise<T>;
};

export default function useSafeRequest(): SafeRequestMethod {
   const authSettings = useSelector(selectAuthInfo);
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

   async function makeSafeRequest<T>(
      requestHandler: () => Promise<T>,
      authIfNotAuthenticated = true,
      forceAuth = false,
      attemptAuthIfFailed = true,
   ): Promise<T> {
      if ((authIfNotAuthenticated && !authSettings) || forceAuth) {
         return await new Promise<T>((resolve, reject) => {
            navigation.push('Login', {
               onAuthenticated: async () => {
                  try {
                     resolve(await makeSafeRequest(requestHandler, false, false, false));
                  } catch (error) {
                     reject(error);
                  }
               },
            });
         });
      }

      try {
         return await requestHandler();
      } catch (error) {
         if (attemptAuthIfFailed) {
            const axiosError = error as AxiosError;
            if (axiosError.isAxiosError && axiosError?.response?.status === 401) {
               return await makeSafeRequest(requestHandler, false, true, false);
            }
         }

         throw error;
      }
   }

   return { authenticated: Boolean(authSettings), makeSafeRequest };
}
