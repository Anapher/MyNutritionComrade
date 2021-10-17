import { DomainError } from 'src/communication-types';
import i18next from 'i18next';
import { AxiosError } from 'axios';
import { FieldPath, UseFormSetError } from 'react-hook-form';

export function formatErrorMessage(error: DomainError): string {
   if (!error.code) {
      if (error.message) return error.message;
      return error.toString();
   }

   return i18next.t(`errors:${error.code}`, error.message, { fields: error.fields });
}

export function axiosErrorToString(error: AxiosError): string {
   if (!error.response) {
      return i18next.t('errors.no_response');
   }

   const domainError = tryExtractDomainError(error);
   if (domainError) {
      return formatErrorMessage(domainError);
   }

   return i18next.t('errors.response_no_success', { status: error.response.status });
}

/**
 * Apply an error to a view
 * @param error the error
 * @param setRequestError set the request error if the error could not be matched to a field
 * @param setError function to set errors on fields
 * @param errorMap maps field keys of the FieldValidationError to form keys
 * @returns the domain error if it could be extracted
 */
export function applyAxiosError<T>(
   error: any,
   setRequestError: (s: string) => void,
   setError?: UseFormSetError<T>,
   errorMap?: Record<string, FieldPath<T>>,
): DomainError | undefined {
   const axiosError = error as AxiosError;
   if (axiosError.isAxiosError) {
      const domainError = tryExtractDomainError(axiosError);
      if (domainError) {
         let appliedError = false;
         if (domainError.fields && domainError.code === 'FieldValidation' && setError) {
            for (const [key, value] of Object.entries(domainError.fields)) {
               if (errorMap) {
                  if (errorMap[key]) setError(errorMap[key], { message: value });
               } else {
                  setError(key as any, { message: value });
               }
            }
         }

         if (appliedError) return domainError;
      }

      setRequestError(axiosErrorToString(axiosError));
      return domainError;
   } else {
      setRequestError(error?.toString());
   }
}

export function tryExtractDomainError(error: AxiosError): DomainError | undefined {
   if (!error.response) return undefined;

   const { data } = error.response;
   if (isDomainError(data)) return data;

   return undefined;
}

/**
 * Checks whether the error response data is a DomainError
 * @param response the error response data
 */
export function isDomainError(response?: any | DomainError): response is DomainError {
   return (
      response !== undefined &&
      typeof response.code === 'string' &&
      typeof response.message === 'string' &&
      typeof response.type === 'string'
   );
}
