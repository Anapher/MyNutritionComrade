import Axios from 'axios';
import { Operation } from 'fast-json-patch';
import { CreateMealDto, Meal } from 'Models';

export async function create(dto: CreateMealDto): Promise<Meal> {
    return (await Axios.post<Meal>('/api/v1/meals', dto)).data;
}

export async function get(): Promise<Meal[]> {
    return (await Axios.get<Meal[]>('/api/v1/meals')).data;
}

export async function remove(id: string): Promise<void> {
    await Axios.delete(`/api/v1/meals/${id}`);
}

export async function patch(id: string, ops: Operation[]): Promise<void> {
    return (await Axios.patch(`/api/v1/meals/${id}`, ops)).data;
}
