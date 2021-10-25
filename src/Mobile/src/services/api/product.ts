import axios from 'axios';
import { Operation } from 'fast-json-patch';
import {
   ProductContributionDto,
   ProductContributionStatusDto,
   ProductOperationsGroup,
   ProductProperties,
} from 'src/types';

export async function create(product: ProductProperties): Promise<void> {
   await axios.post('/api/v1/product', product);
}

export async function getContributionStatus(productId: string): Promise<ProductContributionStatusDto> {
   const result = await axios.get(`/api/v1/product/${productId}/contributions/status`);
   return result.data;
}

export async function previewPatchProduct(
   productId: string,
   operations: Operation[],
): Promise<ProductOperationsGroup[]> {
   const result = await axios.patch(`/api/v1/product/${productId}/preview`, operations);
   return result.data as any;
}

export async function patchProduct(productId: string, operations: Operation[]): Promise<void> {
   await axios.patch(`/api/v1/product/${productId}`, operations);
}

export async function getProductContributions(productId: string): Promise<ProductContributionDto[]> {
   const result = await axios.get(`/api/v1/product/${productId}/contributions`);
   return result.data as any;
}

export async function voteContribution(productId: string, contributionId: string, approve: boolean): Promise<void> {
   await axios.post(`/api/v1/product/${productId}/contributions/${contributionId}/vote`, { approve });
}
