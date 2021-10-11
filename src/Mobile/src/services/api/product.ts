import axios from 'axios';
import { ProductProperties } from 'src/types';

export async function create(product: ProductProperties): Promise<void> {
   await axios.post('/api/v1/product', product);
}
