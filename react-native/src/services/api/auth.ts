import Axios from 'axios';
import { AccessInfo } from 'AppModels';
import { jsonAxiosConfig } from '../api-utils';

export async function signIn(userName: string, password: string): Promise<AccessInfo> {
    return (
        await Axios.post<AccessInfo>('/api/v1/auth/login', {
            userName,
            password,
        })
    ).data;
}

export async function googleSignIn(idToken: string): Promise<AccessInfo> {
    return (await Axios.post<AccessInfo>('/api/v1/auth/login_with_google', JSON.stringify(idToken), jsonAxiosConfig))
        .data;
}

export async function refreshToken(access: AccessInfo): Promise<AccessInfo> {
    return (await Axios.post<AccessInfo>('/api/v1/auth/refreshtoken', access)).data;
}
