import { ProductLabel } from 'Models';

export default function selectLabel(label: ProductLabel[]): string {
    return label[0].value;
}
