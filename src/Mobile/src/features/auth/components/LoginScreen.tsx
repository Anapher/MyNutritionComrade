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
import { axiosErrorToString, formatErrorMessage, tryExtractDomainError } from 'src/utils/error-utils';

const validation = z.object({ emailAddress: z.string().email() });

type FormData = z.infer<typeof validation>;

type Props = {
   navigation: NativeStackNavigationProp<RootNavigatorParamList>;
   route: RouteProp<RootNavigatorParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
   const theme = useTheme();
   const { t } = useTranslation();
   const [requestError, setRequestError] = useState<string | undefined>();

   const {
      control,
      formState: { isValid, isSubmitting },
      handleSubmit,
      setError,
   } = useForm<FormData>({ mode: 'onChange', resolver: zodResolver(validation) });

   const onSubmit = async ({ emailAddress }: FormData) => {
      try {
         setRequestError(undefined);
         await api.authentication.requestPassword(emailAddress);
      } catch (error) {
         const axiosError = error as AxiosError;
         if (axiosError.isAxiosError) {
            const domainError = tryExtractDomainError(axiosError);
            if (domainError) {
               if (domainError.fields) {
                  setError('emailAddress', { message: domainError.fields.emailAddress });
               } else {
                  setRequestError(formatErrorMessage(domainError));
               }
            } else {
               setRequestError(axiosErrorToString(axiosError));
            }
         }
      }
   };

   useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: () => (
            <Button title={t('next')} disabled={!isValid || isSubmitting} onPress={handleSubmit(onSubmit)} />
         ),
      });
   }, [isValid, handleSubmit, isSubmitting]);

   return (
      <View style={styles.root}>
         <Controller
            control={control}
            rules={{ required: true }}
            name="emailAddress"
            render={({ field: { onChange, value }, formState: { isSubmitting } }) => (
               <TextInput
                  disabled={isSubmitting}
                  label={t('email')}
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
               />
            )}
         />
         {requestError && <Text style={[styles.errorText, { color: theme.colors.error }]}>{requestError}</Text>}
         <Text style={styles.descriptionText}>{t('auth.login_description')}</Text>
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
