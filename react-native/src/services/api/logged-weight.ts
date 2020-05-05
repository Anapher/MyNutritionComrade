import Axios from 'axios';
import { UserSettings } from 'Models';
import { Operation } from 'fast-json-patch';

export async function get(): Promise<UserSettings> {
    const response = await Axios.get<UserSettings>('/api/v1/usersettings');
    return response.data;
}

export async function patch(data: Operation[]): Promise<UserSettings> {
    const response = await Axios.patch<UserSettings>('/api/v1/usersettings', data);
    return response.data;
}
