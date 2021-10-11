import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useLayoutEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, StyleSheet, View } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { RootNavigatorParamList } from 'src/RootNavigator';
import { z } from 'zod';
import api from 'src/services/api';
import { AxiosError } from 'axios';
import { applyAxiosError, axiosErrorToString, formatErrorMessage, tryExtractDomainError } from 'src/utils/error-utils';
import { useDispatch } from 'react-redux';
import { setAuthentication } from 'src/features/settings/reducer';

const validation = z.object({ token: z.string().min(0) });

type FormData = z.infer<typeof validation>;

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'LoginPassword'>;
};

export default function LoginScreenPassword({
   navigation,
   route: {
      params: { emailAddress, onAuthenticated },
   },
}: Props) {
   const theme = useTheme();
   const { t } = useTranslation();
   const dispatch = useDispatch();

   const [requestError, setRequestError] = useState<string | undefined>();

   const {
      control,
      formState: { isValid, isSubmitting },
      handleSubmit,
      setError,
   } = useForm<FormData>({ mode: 'onChange', resolver: zodResolver(validation) });

   const onSubmit = async ({ token }: FormData) => {
      setRequestError(undefined);

      try {
         const result = await api.authentication.login(emailAddress, token);
         dispatch(setAuthentication({ email: emailAddress, token: result.jwt }));

         navigation.pop(1);
         onAuthenticated?.();
      } catch (error) {
         applyAxiosError(error, setRequestError, setError, { password: 'token' });
      }
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <Button title={t('auth.login')} disabled={!isValid || isSubmitting} onPress={handleSubmit(onSubmit)} />
         ),
      });
   }, [isValid, handleSubmit, isSubmitting]);

   return (
      <View style={styles.root}>
         <Controller
            control={control}
            rules={{ required: true }}
            name="token"
            render={({ field: { onChange, value }, formState: { isSubmitting, errors } }) => (
               <TextInput
                  disabled={isSubmitting}
                  label={t('auth.password')}
                  autoCompleteType="off"
                  textContentType="password"
                  value={value}
                  onChangeText={onChange}
                  error={Boolean(errors.token || requestError)}
               />
            )}
         />
         {requestError && <Text style={[styles.errorText, { color: theme.colors.error }]}>{requestError}</Text>}
         <Text style={styles.descriptionText}>{t('auth.password_description')}</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   root: {
      margin: 16,
   },
   descriptionText: {
      marginTop: 16,
   },
   errorText: {
      marginTop: 8,
   },
});
