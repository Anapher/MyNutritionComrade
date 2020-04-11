declare module 'MyNutritionComrade' {
    export type Services = typeof import('./index').default;

    export type PagingResponse<T> = {
        links: PagingLinks;
        meta: PagingMetadata;
        data: T[];
    };

    export type PagingLinks = {
        prev: string;
        next: string;
    };

    export type PagingMetadata = {
        totalRecords: number;
    };
}
