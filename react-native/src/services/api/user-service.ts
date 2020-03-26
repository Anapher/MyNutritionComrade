import Axios from 'axios';
import { FrequentlyUsedProducts } from 'Models';

export async function loadFrequentlyUsedProducts(): Promise<FrequentlyUsedProducts> {
    const response = await Axios.get<FrequentlyUsedProducts>('/api/v1/userservice/frequently_used_products');
    return response.data;
}
