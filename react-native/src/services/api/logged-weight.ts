import Axios from 'axios';
import { LoggedWeight } from 'Models';
import { PagingResponse } from 'MyNutritionComrade';
import { jsonAxiosConfig } from '../api-utils';

export async function get(): Promise<PagingResponse<LoggedWeight>> {
    return (await Axios.get('/api/v1/loggedweight')).data;
}

export async function getByUrl(url: string): Promise<PagingResponse<LoggedWeight>> {
    return (await Axios.get(url)).data;
}

export async function add(data: LoggedWeight): Promise<LoggedWeight> {
    const response = await Axios.put<LoggedWeight>(
        `/api/v1/loggedweight/${data.timestamp}`,
        data.value.toString(),
        jsonAxiosConfig,
    );
    return response.data;
}

export async function deleteEntry(timestamp: string): Promise<void> {
    await Axios.delete(`/api/v1/loggedweight/${timestamp}`);
}
