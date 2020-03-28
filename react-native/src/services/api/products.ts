import Axios from 'axios';
import { ProductInfo, Product, ProductSearchDto } from 'Models';

export async function create(productInfo: ProductInfo): Promise<Product> {
    const response = await Axios.post<Product>('/api/v1/products', productInfo);
    return response.data;
}

export async function search(term: string, units?: string[]): Promise<ProductSearchDto[]> {
    const queryDictionary: any = { term };
    if (units) queryDictionary['units'] = units.join(',');
    const params = new URLSearchParams(queryDictionary);

    const response = await Axios.get<ProductSearchDto[]>(`/api/v1/products/search?${params.toString()}`);
    return response.data;
}
