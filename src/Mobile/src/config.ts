import { ProductRepositoryLink } from 'src/services/product-repository-factory';

type Config = {
   productRepositories: ProductRepositoryLink[];
   userDataDatabaseName: string;
};

const config: Config = {
   // specifies the urls products can be retrieved from
   productRepositories: [
      {
         key: 'github',
         url: 'https://anapher.github.io/MyNutritionComrade.Products/index.json',
         pollFrequencyHours: 24 * 4, // 4 days
      },
   ],
   userDataDatabaseName: 'data',
};

export default config;
