declare module 'AppModels' {
    export type AccessInfo = Readonly<{
        accessToken: string;
        refreshToken: string;
    }>;
}
