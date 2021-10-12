import { ProductRepositoryLink } from 'src/services/product-repository-factory';

type WriteRepository = {
   key: string;
   url: string;
   baseUrl: string;
};

type Config = {
   productRepositories: ProductRepositoryLink[];
   userDataDatabaseName: string;
   writeRepository: WriteRepository;
};

const writeRepository: WriteRepository = {
   key: 'openstrive',
   url: 'https://nutritions.openstrive.org/api/v1/product/index.json',
   baseUrl: 'https://nutritions.openstrive.org/',
};

const config: Config = {
   // specifies the urls products can be retrieved from
   productRepositories: [
      {
         key: 'github',
         url: 'https://anapher.github.io/MyNutritionComrade.Products/index.json',
         pollFrequencyHours: 24 * 4, // 4 days
      },
      {
         ...writeRepository,
         pollFrequencyHours: 24, // 1 day
      },
   ],
   userDataDatabaseName: 'data',
   writeRepository,
};

export default config;
