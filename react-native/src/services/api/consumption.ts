import Axios from 'axios';
import { ConsumptionTime, ConsumedProduct } from 'Models';

export function setConsumption(date: string, type: ConsumptionTime, productId: string, value: number): Promise<any> {
    return Axios.put(`/api/v1/consumption/${date}/${type}/${productId}`, { value });
}

export async function getDayConsumption(date: string): Promise<ConsumedProduct[]> {
    const response = await Axios.get(`/api/v1/consumption/${date}`);
    return response.data;
}
