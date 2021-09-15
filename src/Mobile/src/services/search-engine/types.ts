import { ConsumptionTime } from 'src/types';

type SuggestionType = 'product' | 'meal';

export interface ProductSearchConfig {
   consumptionTime?: ConsumptionTime;
   date?: string;
   filter?: SuggestionType[];
   disableMealCreation?: boolean;
}
