import Axios from 'axios';
import {
    PatchOperation,
    Product,
    ProductContributionDto,
    ProductContributionStatus,
    ProductInfo,
    ProductProperties,
    SuggestionType,
    SearchResult,
    ProductSuggestion,
} from 'Models';
import { PagingResponse } from 'MyNutritionComrade';
import { jsonAxiosConfig } from '../api-utils';

export async function create(productInfo: ProductProperties): Promise<Product> {
    return (await Axios.post<Product>('/api/v1/products', productInfo)).data;
}

export async function patch(id: string, operations: PatchOperation[]): Promise<void> {
    await Axios.patch(`/api/v1/products/${id}`, operations);
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
    return (await Axios.get(url)).data;
}

export async function search(term: string, units?: string[], filter?: SuggestionType[]): Promise<SearchResult[]> {
    const queryDictionary: any = { term };
    if (units) queryDictionary['units'] = units.join(',');
    if (filter) queryDictionary['consumables_filter'] = filter.join(',');

    const params = new URLSearchParams(queryDictionary);
    return (await Axios.get<SearchResult[]>(`/api/v1/products/search?${params.toString()}`)).data;
}

export async function searchByBarcode(barcode: string): Promise<ProductInfo | undefined> {
    const queryDictionary: any = { barcode };
    const params = new URLSearchParams(queryDictionary);

    const response = await Axios.get<ProductSuggestion[]>(`/api/v1/products/search?${params.toString()}`);
    return response.data?.length === 0 ? undefined : response.data[0].product;
}

export async function getById(id: string): Promise<ProductInfo> {
    return (await Axios.get<ProductInfo>(`/api/v1/products/${id}`)).data;
}

export async function voteContribution(contributionId: string, approve: boolean): Promise<ProductContributionDto> {
    const response = await Axios.post<ProductContributionDto>(
        `/api/v1/products/contributions/${contributionId}/vote`,
        approve.toString(),
        jsonAxiosConfig,
    );
    return response.data;
}
