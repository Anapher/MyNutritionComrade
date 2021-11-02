import { Product } from 'src/types';
import { DateTime } from 'luxon';
import { retriveStoredRepository, StoredCatalog } from './product-data-storage';
import _ from 'lodash';
import { computeHashCode } from 'src/utils/string-utils';

export type ProductRepositoryLink = { key: string; url: string; pollFrequencyHours: number };

type InitializationResultReady = InitializationResultBase & {
   type: 'ready';
   data: Record<string, Product>;
   dataHash: number;
};

type InitializationResultUpdateRequired = InitializationResultBase & {
   type: 'update-required';
   data: Record<string, Product>;
   dataHash: number;
   reposThatNeedUpdate: string[];
};
type InitializationResultNotInitialized = InitializationResultBase & { type: 'not-initialized' };

export type InitializationResult =
   | InitializationResultReady
   | InitializationResultUpdateRequired
   | InitializationResultNotInitialized;

export type InitializationResultBase = {
   repoStatistics: Record<string, RepositoryStatistics>;
};

export type RepositoryStatistics = {
   lastUpdated: string;
   catalogsCount: number;
   productsCount: number;
};

/**
 * Attempt to create a product index from local data
 * @param repositories the product repositories that should be included
 * @returns the result depending on the retrived data
 */
export async function createProductIndex(repositories: ProductRepositoryLink[]): Promise<InitializationResult> {
   const products: Record<string, Product> = {};
   const reposThatNeedUpdate = new Array<string>();
   let hasProduct = false;
   const repoStatistics: Record<string, RepositoryStatistics> = {};

   const hashBuiler = new Array<string>();

   for (const link of repositories) {
      const storedResult = await fetchRepositoryDataLocally(link);
      if (storedResult.initialized) {
         const { catalogs, lastUpdated } = storedResult;

         for (const [url, catalog] of Object.entries(catalogs)) {
            for (const product of catalog.data) {
               products[product.id] = product;
               hasProduct = true;
            }

            hashBuiler.push(`${catalog.timestamp}/${url}`);
         }

         repoStatistics[link.key] = {
            catalogsCount: Object.values(catalogs).length,
            lastUpdated,
            productsCount: _.sumBy(Object.values(catalogs), (x) => x.data.length),
         };
      }

      if (storedResult.updateRequired) reposThatNeedUpdate.push(link.key);
   }

   if (hasProduct) {
      const dataHash = computeHashCode(hashBuiler.join('|'));

      if (reposThatNeedUpdate.length > 0) {
         return {
            type: 'update-required',
            data: products,
            reposThatNeedUpdate,
            repoStatistics,
            dataHash,
         };
      }

      return { type: 'ready', data: products, repoStatistics, dataHash };
   }

   return { type: 'not-initialized', repoStatistics };
}

type FetchedDataFound = {
   initialized: true;
   catalogs: { [url: string]: StoredCatalog };
   lastUpdated: string;
   updateRequired: boolean;
};

type FetchedDataNotFound = {
   initialized: false;
   updateRequired: true;
};

async function fetchRepositoryDataLocally(
   link: ProductRepositoryLink,
): Promise<FetchedDataFound | FetchedDataNotFound> {
   const result = await retriveStoredRepository(link);
   if (result) {
      const updateRequired = isUpdateRequired(result.lastUpdated, link);
      return {
         initialized: true,
         catalogs: result.catalogs,
         updateRequired,
         lastUpdated: result.lastUpdated,
      };
   } else {
      return { initialized: false, updateRequired: true };
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
