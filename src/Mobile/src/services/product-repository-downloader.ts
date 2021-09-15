import { DateTime } from 'luxon';
import axios from 'axios';
import { retriveStoredRepository, StoredRepositoryData, StoredCatalog, storeRepository } from './product-data-storage';
import { ProductRepositoryLink } from './product-repository-factory';
import { Product } from 'src/types';
import { isRelativeUrl } from 'src/utils/url-utils';

export type ProductIndex = { url: string; timestamp: string };
export type ProductIndexResponse = ProductIndex[];

type ProgressReporter = (currentLink: ProductRepositoryLink) => void;

export async function downloadProductRepositories(links: ProductRepositoryLink[], reporter?: ProgressReporter) {
   console.log('download', links);

   for (const link of links) {
      reporter?.(link);
      try {
         await downloadProductRepository(link);
      } catch (error) {
         // ignore
      }
   }
}

async function downloadProductRepository(link: ProductRepositoryLink): Promise<void> {
   const result = await axios.get(link.url);
   const index: ProductIndexResponse = result.data;

   const storedData = (await retriveStoredRepository(link)) ?? { lastUpdated: '', catalogs: {} };
   const updatedStoredData: StoredRepositoryData = { lastUpdated: DateTime.now().toISO(), catalogs: {} };

   for (const catalogInfo of index) {
      const catalogData = await getCatalogData(catalogInfo, link, storedData);
      if (catalogData) {
         updatedStoredData.catalogs[catalogInfo.url] = catalogData;
      }
   }

   await storeRepository(link, updatedStoredData);
}

async function getCatalogData(
   catalog: ProductIndex,
   link: ProductRepositoryLink,
   storedData: StoredRepositoryData,
): Promise<StoredCatalog | undefined> {
   const storedCatalog = storedData.catalogs[catalog.url];

   if (storedCatalog && DateTime.fromISO(storedCatalog.timestamp) >= DateTime.fromISO(catalog.timestamp)) {
      return storedCatalog;
   }

   try {
      const products = await downloadCatalogData(catalog, link);
      return { data: products, timestamp: catalog.timestamp };
   } catch (error) {
      return storedCatalog;
   }
}

async function downloadCatalogData(catalog: ProductIndex, link: ProductRepositoryLink): Promise<Product[]> {
   let url = catalog.url;
   if (isRelativeUrl(url)) url = link.url + '/' + url;

   const result = await axios.get(url);
   return result.data;
}
