import Axios from 'axios';
import { ProductInfo, Product } from 'Models';

export async function create(productInfo: ProductInfo): Promise<Product> {
    const response = await Axios.post<Product>('/api/v1/products', productInfo);
    return response.data;
}
