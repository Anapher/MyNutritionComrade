import Axios from 'axios';
import {
    PatchOperation,
    Product,
    ProductContributionDto,
    ProductDto,
    ProductInfo,
    ProductProperties,
    ProductContributionStatus,
} from 'Models';
import { PagingResponse } from 'MyNutritionComrade';

export async function create(productInfo: ProductProperties): Promise<Product> {
    const response = await Axios.post<Product>('/api/v1/products', productInfo);
    return response.data;
}

export async function patch(id: string, operations: PatchOperation[]): Promise<void> {
    return await Axios.patch(`/api/v1/products/${id}`, operations);
}

export async function getContributions(
    id: string,
    statusFilter?: ProductContributionStatus,
): Promise<PagingResponse<ProductContributionDto>> {
    const response = await Axios.get(
        statusFilter
            ? `/api/v1/products/${id}/contributions?status=${statusFilter}`
            : `/api/v1/products/${id}/contributions`,
    );
    return response.data;
}

export async function getContributionsByUrl(url: string): Promise<PagingResponse<ProductContributionDto>> {
    const response = await Axios.get(url);
    return response.data;
}

export async function search(term: string, units?: string[]): Promise<ProductInfo[]> {
    const queryDictionary: any = { term };
    if (units) queryDictionary['units'] = units.join(',');
    const params = new URLSearchParams(queryDictionary);

    const response = await Axios.get<ProductInfo[]>(`/api/v1/products/search?${params.toString()}`);
    return response.data;
}

export async function searchByBarcode(barcode: string): Promise<ProductInfo | undefined> {
    const queryDictionary: any = { barcode };
    const params = new URLSearchParams(queryDictionary);

    const response = await Axios.get<ProductInfo[]>(`/api/v1/products/search?${params.toString()}`);
    return response.data?.length === 0 ? undefined : response.data[0];
}

export async function getById(id: string): Promise<ProductDto> {
    const response = await Axios.get<ProductDto>(`/api/v1/products/${id}`);
    return response.data;
}

export async function voteContribution(contributionId: string, approve: boolean): Promise<ProductContributionDto> {
    const response = await Axios.post<ProductContributionDto>(`/api/v1/products/contributions/${contributionId}/vote`, {
        approve,
    });
    return response.data;
}
