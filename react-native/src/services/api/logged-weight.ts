import Axios from 'axios';
import { LoggedWeight } from 'Models';
import { PagingResponse } from 'MyNutritionComrade';

export async function get(): Promise<PagingResponse<LoggedWeight>> {
    const response = await Axios.get('/api/v1/loggedweight');
    return response.data;
}

export async function getByUrl(url: string): Promise<PagingResponse<LoggedWeight>> {
    const response = await Axios.get(url);
    return response.data;
}

export async function add(data: LoggedWeight): Promise<LoggedWeight> {
    const response = await Axios.put<LoggedWeight>(`/api/v1/loggedweight/${data.timestamp}`, data.value.toString(), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
}

export async function deleteEntry(timestamp: string): Promise<void> {
    await Axios.delete(`/api/v1/loggedweight/${timestamp}`);
}
