declare module 'AppModels' {
    export type AccessInfo = Readonly<{
        accessToken: string;
        refreshToken: string;
    }>;

    export interface SignInRequest {
        userName: string;
        password: string;
        rememberMe: boolean;
    }
}
