import { Product } from 'src/types';
import { DateTime } from 'luxon';
import { retriveStoredRepository, StoredCatalog } from './product-data-storage';

export type ProductRepositoryLink = { key: string; url: string; pollFrequencyHours: number };

type InitializationResultReady = { type: 'ready'; data: Record<string, Product> };
type InitializationResultUpdateRequired = {
   type: 'update-required';
   data: Record<string, Product>;
   reposThatNeedUpdate: string[];
};
type InitializationResultNotInitialized = { type: 'not-initialized' };

export type InitializationResult =
   | InitializationResultReady
   | InitializationResultUpdateRequired
   | InitializationResultNotInitialized;

/**
 * Attempt to create a product repository from local data
 * @param repositories the product repositories that should be included
 * @returns the result depending on the retrived data
 */
export async function createProductRepository(repositories: ProductRepositoryLink[]): Promise<InitializationResult> {
   const products: Record<string, Product> = {};
   const reposThatNeedUpdate = new Array<string>();
   let hasProduct = false;

   for (const link of repositories) {
      const { data, updateRequired } = await fetchRepositoryDataLocally(link);
      if (data) {
         for (const catalog of data) {
            for (const product of catalog.data) {
               products[product.id] = product;
               hasProduct = true;
            }
         }
      }
      if (updateRequired) reposThatNeedUpdate.push(link.key);
   }

   if (hasProduct) {
      if (reposThatNeedUpdate.length > 0) {
         return { type: 'update-required', data: products, reposThatNeedUpdate };
      }

      return { type: 'ready', data: products };
   }

   return { type: 'not-initialized' };
}

async function fetchRepositoryDataLocally(link: ProductRepositoryLink): Promise<{
   data?: StoredCatalog[];
   updateRequired: boolean;
}> {
   const result = await retriveStoredRepository(link);
   if (result) {
      const updateRequired = isUpdateRequired(result.lastUpdated, link);
      return { data: Object.values(result.catalogs), updateRequired };
   } else {
      // especially uninitialized
      return { updateRequired: true };
   }
}

/**
 * Determine by the timestamp of the data and the update frequency of the repository whether an update is required
 * @param dataTimestamp the timestamp of the stored data
 * @param link the link of the repository
 * @returns true if an update is required
 */
function isUpdateRequired(dataTimestamp: string, link: ProductRepositoryLink): boolean {
   const timestamp = DateTime.fromISO(dataTimestamp);
   const dataAge = DateTime.now().diff(timestamp);

   return dataAge.hours > link.pollFrequencyHours;
}
