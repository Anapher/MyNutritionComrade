import { FormikHelpers } from 'formik';
import { RequestErrorResponse, isRestError, isServerUnavailable, toString } from 'src/utils/error-result';

/**
 * Apply the error using formik action. If field errors are specified, they will be set using setErrors.
 * Else, the status will be set using setStatus.
 * @param error the response error
 * @param param1 formik actions
 */
export function applyError<T>(error: RequestErrorResponse, { setStatus, setErrors }: FormikHelpers<T>) {
    const response = error as RequestErrorResponse;
    if (isServerUnavailable(response) || !isRestError(response.response) || !response.response.fields) {
        setStatus(toString(response));
    } else {
        setStatus(null);
        setErrors(response.response.fields as any);
    }
}
