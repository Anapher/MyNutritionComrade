export type ErrorType = 'BadRequest' | 'Conflict' | 'InternalServerError' | 'Forbidden' | 'NotFound';

export type DomainError = {
   type: ErrorType;
   message: string;
   code: string;
   fields?: Record<string, string>;
};
