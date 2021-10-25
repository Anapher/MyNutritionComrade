import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { axiosErrorToString } from 'src/utils/error-utils';

export default function useRequestData<T>(
   onRequest: () => Promise<T>,
   initialValue?: T,
): [T | undefined, boolean, string | undefined, () => void] {
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState<T | undefined>(initialValue);
   const [error, setError] = useState<string | undefined>();

   const attemptRequest = async () => {
      setError(undefined);
      setLoading(true);
      try {
         const data = await onRequest();
         setData(data);
      } catch (error) {
         const axiosError = error as AxiosError;
         if (axiosError.isAxiosError) {
            setError(axiosErrorToString(axiosError));
         } else {
            setError((error as any).toString());
         }
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (!data) {
         attemptRequest();
      }
   }, []);

   return [data, loading, error, attemptRequest];
}
