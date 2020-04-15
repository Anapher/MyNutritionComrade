import Axios from 'axios';
import { ConsumptionTime, ProductConsumptionDates } from 'Models';

export function setConsumption(date: string, type: ConsumptionTime, productId: string, value: number): Promise<any> {
    return Axios.put(`/api/v1/consumption/${date}/${type}/${productId}`, { value });
}

export async function getConsumedProducts(date: string, to?: string): Promise<ProductConsumptionDates> {
    const response = await Axios.get(`/api/v1/consumption/${date}${to ? '?to=' + to : ''}`);
    return response.data;
}
