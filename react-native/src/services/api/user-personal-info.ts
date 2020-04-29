import Axios from 'axios';
import { UserPersonalInfo } from 'Models';
import { Operation } from 'fast-json-patch';

export async function get(): Promise<UserPersonalInfo> {
    const response = await Axios.get<UserPersonalInfo>('/api/v1/userpersonalinfo');
    return response.data;
}

export async function patch(data: Operation[]): Promise<UserPersonalInfo> {
    const response = await Axios.patch<UserPersonalInfo>('/api/v1/userpersonalinfo', data);
    return response.data;
}
