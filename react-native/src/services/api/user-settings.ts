import Axios from 'axios';
import { UserSettings } from 'Models';
import { Operation } from 'fast-json-patch';

export async function get(): Promise<UserSettings> {
    return (await Axios.get<UserSettings>('/api/v1/usersettings')).data;
}

export async function patch(data: Operation[]): Promise<UserSettings> {
    return (await Axios.patch<UserSettings>('/api/v1/usersettings', data)).data;
}
