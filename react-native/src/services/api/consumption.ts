import Axios from 'axios';
import { ConsumedDto, ConsumptionTime, FoodPortionCreationDto, ProductConsumptionDates } from 'Models';

export async function createConsumption(
    date: string,
    type: ConsumptionTime,
    foodPortion: FoodPortionCreationDto,
): Promise<ConsumedDto> {
    return (await Axios.put(`/api/v1/consumption/${date}/${type}`, foodPortion)).data;
}

export async function getConsumedProducts(date: string, to?: string): Promise<ProductConsumptionDates> {
    return (await Axios.get(`/api/v1/consumption/${date}${to ? '?to=' + to : ''}`)).data;
}

export async function deleteConsumption(date: string, type: string, id: string): Promise<any> {
    return Axios.delete(`/api/v1/consumption/${date}/${type}/${encodeURIComponent(id)}`);
}
