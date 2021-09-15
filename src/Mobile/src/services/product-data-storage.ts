import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from 'src/types';
import { ProductRepositoryLink } from './product-repository-factory';

export type StoredCatalog = { timestamp: string; data: Product[] };

export type StoredRepositoryData = {
   lastUpdated: string;
   catalogs: { [url: string]: StoredCatalog };
};

const getRepositoryStorageKey = (link: ProductRepositoryLink) => `repository_data_${link.key}`;

export async function retriveStoredRepository(link: ProductRepositoryLink): Promise<StoredRepositoryData | undefined> {
   const storageKey = getRepositoryStorageKey(link);

   try {
      const result = await AsyncStorage.getItem(storageKey);
      if (result === null) return undefined;

      return JSON.parse(result);
   } catch (error) {
      return undefined;
   }
}

export async function storeRepository(link: ProductRepositoryLink, data: StoredRepositoryData): Promise<void> {
   const storageKey = getRepositoryStorageKey(link);

   await AsyncStorage.setItem(storageKey, JSON.stringify(data));
}
