import { AxiosError } from 'axios';

/**
 * An error response from a web request
 */
export interface RequestErrorResponse {
    /** the HTTP status code returned from the server. If null, the server couldn't be reached */
    status: number | null;
    /** the data returned from the server. If the exception was propaply handled, this will be an IRestError, else it might just be a string (you can check with isRestError) */
    response?: RestError | any;
}

/**
 * Return true if the error was thrown because the server was not reachable
 * @param response the error response
 */
export function isServerUnavailable(response: RequestErrorResponse): boolean {
    return response.status === null;
}

/**
 * Checks whether the error response data is a IRestError
 * @param response the error response data
 */
export function isRestError(response: any | RestError): response is RestError {
    return response.code !== undefined && response.message !== undefined && response.type !== undefined;
}

/**
 * Converts the error object to a human readable string that handles all possible exception states
 * @param error the error response
 */
export function toString(error: RequestErrorResponse): string {
    if (isServerUnavailable(error)) {
        return 'The server is currently unavailable.';
    }

    const { response, status } = error;
    if (!response) {
        return `The server responded with status code ${status} and an empty body`;
    }

    if (!isRestError(response)) {
        return `The server responded with status code ${status} and an unexpected body: ${response}`;
    }

    if (response.type === 'ValidationError') {
        return `The server responded with validation errors. Invalid fields: ${Object.keys(response.fields!).join(
            ', ',
        )}.`;
    }

    return `${response.message} (code: ${response.code})`;
}

/**
 * A rest error thrown by the business code of the server
 */
export interface RestError {
    /** the type of the error */
    type: 'ValidationError';

    /** a human readable error message */
    message: string;

    /** the error code */
    code: number;

    /** fields that are responsible for this error including a more specific description about the error state */
    fields?: {};
}

/**
 * Maps an axios error to an error result
 * @param error the axios error
 */
export function toErrorResult(error: AxiosError): RequestErrorResponse {
    const { response } = error;

    if (!response) {
        return { response: null, status: null }; // the server didn't answer
    }

    return { response: response.data, status: response.status };
}

export default toErrorResult;
