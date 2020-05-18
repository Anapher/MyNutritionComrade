import { ServingSize, Conversion } from 'Models';

// Match a decimal number (optional), a unit (optional) and everything else
const regex = /^(\d*(?:[\.,]\d+)?)?\s*([a-zA-Z]+)?(.*)$/;

interface ServingType {
    keywords: string[];
    id: string;
    conversionFactor?: number;
}

const servingTypes: ServingType[] = [
    {
        id: 'g',
        keywords: ['g', 'gram'],
        conversionFactor: 1,
    },
    {
        id: 'g',
        keywords: ['kg'],
        conversionFactor: 1000,
    },
    {
        id: 'g',
        keywords: ['lb'],
        conversionFactor: 453.5924,
    },
    {
        id: 'piece',
        keywords: ['piece', 'p'],
    },
    {
        id: 'slice',
        keywords: ['slice', 'slices'],
    },
    {
        id: 'medium',
        keywords: ['m', 'medium'],
    },
    {
        id: 'small',
        keywords: ['s', 'small'],
    },
    {
        id: 'large',
        keywords: ['l', 'large'],
    },
    {
        id: 'bread',
        keywords: ['bread'],
    },
    {
        id: 'ml',
        keywords: ['l', 'liter'],
        conversionFactor: 1000,
    },
    {
        id: 'ml',
        keywords: ['ml'],
    },
];

export interface ProductSearchQuery {
    serving?: Partial<ServingSize>[];
    productSearch?: string;
}

/**
 * Interpret an input an try to parse an amount and a unit. Return the parsed result
 * @param input the input string
 */
export function tryParseServingSize(input: string): ProductSearchQuery {
    const m = input.match(regex);
    if (m === null) return {};

    const amount = m[1] ? Number(m[1]) : undefined;
    const unit = m[2] ? m[2].trim() : undefined;

    if (unit === undefined && amount === undefined) {
        return {};
    }

    if (unit === undefined) {
        return { serving: [{ amount: amount }] };
    }

    let productSearch = m[3] ? m[3].trim() : undefined;

    const servingTypes = tryMatchServingType(unit);
    if (servingTypes === undefined) {
        if (productSearch !== undefined) {
            productSearch = unit + ' ' + productSearch;
        } else {
            productSearch = unit;
        }

        if (amount === undefined) {
            return { productSearch };
        }

        return { productSearch, serving: [{ amount: amount }] };
    }

    const serving: ServingSize[] = servingTypes.map((x) => ({
        amount: amount || 0 * (x.conversion?.factor || 1),
        servingType: x.servingType,
        conversion: x.conversion,
    }));
    return { serving, productSearch };
}

type ParsedServing = {
    servingType: string;
    conversion?: Conversion;
};

/**
 * Try to interpret a unit (kg, g, ml, etc.). If no exact match is found, it will try to find using substrings
 * @param unit The unit string
 * @returns Returns the serving type matches or undefined if none is found
 */
function tryMatchServingType(unit: string): ParsedServing[] | undefined {
    unit = unit.toLowerCase();

    const result: ParsedServing[] = [];

    // search for exact match
    for (const servingType of servingTypes) {
        for (const keyword of servingType.keywords) {
            if (keyword === unit) {
                result.push({
                    servingType: servingType.id,
                    conversion:
                        servingType.conversionFactor !== undefined
                            ? { factor: servingType.conversionFactor!, name: keyword }
                            : undefined,
                });
            }
        }
    }

    if (result.length > 0) return result;

    // search by startsWith
    for (const servingType of servingTypes) {
        for (const keyword of servingType.keywords) {
            if (keyword.startsWith(unit)) {
                return [
                    {
                        servingType: servingType.id,
                        conversion:
                            servingType.conversionFactor !== undefined
                                ? {
                                      factor: servingType.conversionFactor!,
                                      name: keyword,
                                  }
                                : undefined,
                    },
                ];
            }
        }
    }

    if (result.length > 0) return result;

    return undefined;
}
