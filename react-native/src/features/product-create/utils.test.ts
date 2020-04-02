import { TagLiquid } from 'src/consts';
import itiriri from 'itiriri';
import { ProductInfo, NutritionalInformation, PatchOperation } from 'Models';
import { createPatch, reducePatch } from './utils';

const emptyProduct: ProductInfo = {
    defaultServing: 'g',
    nutritionalInformation: {
        volume: 0,
        energy: 0,
        fat: 0,
        saturatedFat: 0,
        carbohydrates: 0,
        sugars: 0,
        protein: 0,
        dietaryFiber: 0,
        sodium: 0,
    },
    tags: [],
    servings: {
        g: 1,
    },
    label: [],
};

test('should create empty patch with no changed properties', () => {
    const result = itiriri(createPatch(emptyProduct, emptyProduct)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(0);
});

test('should create patch with new barcode correctly', () => {
    const product1: ProductInfo = emptyProduct;
    const product2: ProductInfo = { ...emptyProduct, code: '123456' };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('set');

    if (op.type === 'set') {
        expect(op.path).toBe('code');
        expect(op.value).toBe('123456');
    }
});

test('should create patch with no barcode correctly', () => {
    const product1: ProductInfo = { ...emptyProduct, code: '123456' };
    const product2: ProductInfo = emptyProduct;

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('unset');
    expect(op.path).toBe('code');
});

test('should create patch with changed barcode correctly', () => {
    const product1: ProductInfo = { ...emptyProduct, code: '123456' };
    const product2: ProductInfo = { ...emptyProduct, code: '654321' };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('set');

    if (op.type === 'set') {
        expect(op.path).toBe('code');
        expect(op.value).toBe('654321');
    }
});

test('should create patch with changed nutrition info correctly', () => {
    const nutritionalInformation: NutritionalInformation = {
        volume: 100,
        energy: 244,
        fat: 10,
        saturatedFat: 4,
        carbohydrates: 60,
        sugars: 4,
        protein: 12,
        dietaryFiber: 1,
        sodium: 0.1,
    };
    const changedNutritionInfo = { ...nutritionalInformation, carbohydrates: 62 };

    const product1: ProductInfo = { ...emptyProduct, nutritionalInformation: nutritionalInformation };
    const product2: ProductInfo = {
        ...emptyProduct,
        nutritionalInformation: changedNutritionInfo,
    };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('set');

    if (op.type === 'set') {
        expect(op.path).toBe('nutritionalInformation.carbohydrates');
        expect(op.value).toBe(62);
    }
});

test('should create patch with changed default serving correctly', () => {
    const product1: ProductInfo = emptyProduct;
    const product2: ProductInfo = { ...emptyProduct, defaultServing: 'piece' };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('set');

    if (op.type === 'set') {
        expect(op.path).toBe('defaultServing');
        expect(op.value).toEqual('piece');
    }
});

test('should create patch with added tag correctly', () => {
    const product1: ProductInfo = emptyProduct;
    const product2: ProductInfo = { ...emptyProduct, tags: ['test'] };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('add');

    if (op.type === 'add') {
        expect(op.path).toBe('tags');
        expect(op.item).toEqual('test');
    }
});

test('should create patch with added tag correctly when tags already exist', () => {
    const product1: ProductInfo = { ...emptyProduct, tags: ['test'] };
    const product2: ProductInfo = { ...emptyProduct, tags: ['test', 'hello'] };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('add');

    if (op.type === 'add') {
        expect(op.path).toBe('tags');
        expect(op.item).toEqual('hello');
    }
});

test('should create patch with removed tag correctly', () => {
    const product1: ProductInfo = { ...emptyProduct, tags: ['test'] };
    const product2: ProductInfo = { ...emptyProduct, tags: [] };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('remove');

    if (op.type === 'remove') {
        expect(op.path).toBe('tags');
        expect(op.item).toEqual('test');
    }
});

test('should create patch with removed tag correctly when other items exist', () => {
    const product1: ProductInfo = { ...emptyProduct, tags: ['hello', 'test'] };
    const product2: ProductInfo = { ...emptyProduct, tags: ['hello'] };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('remove');

    if (op.type === 'remove') {
        expect(op.path).toBe('tags');
        expect(op.item).toBe('test');
    }
});

test('should create patch with added label', () => {
    const product1: ProductInfo = { ...emptyProduct };
    const product2: ProductInfo = { ...emptyProduct, label: [{ languageCode: 'de', value: 'test label' }] };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('add');

    if (op.type === 'add') {
        expect(op.path).toBe('label');
        expect(op.item).toEqual({ languageCode: 'de', value: 'test label' });
    }
});

test('should create patch with removed label', () => {
    const product1: ProductInfo = { ...emptyProduct, label: [{ languageCode: 'de', value: 'test label' }] };
    const product2: ProductInfo = { ...emptyProduct };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('remove');

    if (op.type === 'remove') {
        expect(op.path).toBe('label');
        expect(op.item).toEqual({ languageCode: 'de', value: 'test label' });
    }
});

test('should create patch with added serving', () => {
    const product1: ProductInfo = { ...emptyProduct };
    const product2: ProductInfo = { ...emptyProduct, servings: { ...emptyProduct.servings, piece: 27 } };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('set');

    if (op.type === 'set') {
        expect(op.path).toBe('servings.piece');
        expect(op.value).toBe(27);
    }
});

test('should create patch with removed serving', () => {
    const product1: ProductInfo = { ...emptyProduct };
    const product2: ProductInfo = { ...emptyProduct, servings: {} };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('unset');

    if (op.type === 'unset') {
        expect(op.path).toBe('servings.g');
    }
});

test('should create patch with changed serving', () => {
    const product1: ProductInfo = { ...emptyProduct };
    const product2: ProductInfo = { ...emptyProduct, servings: { g: 2 } };

    const result = itiriri(createPatch(product1, product2)).toArray();

    expect(result).toBeTruthy();
    expect(result.length).toBe(1);

    const op = result[0];
    expect(op.type).toBe('set');

    if (op.type === 'set') {
        expect(op.path).toBe('servings.g');
        expect(op.value).toBe(2);
    }
});

function* arrayToGenerator<T>(array: T[]): Generator<T, any, undefined> {
    yield* array;
}

test('should reduce replaced labels', () => {
    const patch: PatchOperation[] = [
        { path: 'label', type: 'add', item: { languageCode: 'de', value: 'Hallo Welt' } },
        { path: 'label', type: 'remove', item: { languageCode: 'de', value: 'Hallo Wetl' } },
        { path: 'code', type: 'set', value: '123456' },
    ];

    const result = itiriri(reducePatch(arrayToGenerator(patch))).toArray();

    expect(result.length).toBe(2);
    const op = result[0];
    expect(op.length).toBe(2);
    expect(op).toEqual(
        jasmine.arrayContaining([
            { path: 'label', type: 'add', item: { languageCode: 'de', value: 'Hallo Welt' } },
            { path: 'label', type: 'remove', item: { languageCode: 'de', value: 'Hallo Wetl' } },
        ]),
    );
});

test('should not reduce labels with different language', () => {
    const patch: PatchOperation[] = [
        { path: 'label', type: 'add', item: { languageCode: 'en', value: 'Hallo Welt' } },
        { path: 'label', type: 'remove', item: { languageCode: 'de', value: 'Hallo Wetl' } },
        { path: 'code', type: 'set', value: '123456' },
    ];

    const result = itiriri(reducePatch(arrayToGenerator(patch))).toArray();

    expect(result.length).toBe(3);
    expect(result).toEqual(jasmine.arrayContaining(patch.map((x) => [x])));
});

test('should reduce changes to liquid state', () => {
    const patch: PatchOperation[] = [
        { path: 'tags', type: 'add', item: TagLiquid },
        { path: 'servings.g', type: 'unset' },
        { path: 'servings.ml', type: 'set', value: 1 },
        { path: 'code', type: 'set', value: '123456' },
    ];

    const result = itiriri(reducePatch(arrayToGenerator(patch))).toArray();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(
        jasmine.arrayContaining([
            { path: 'tags', type: 'add', item: TagLiquid },
            { path: 'servings.g', type: 'unset' },
            { path: 'servings.ml', type: 'set', value: 1 },
        ]),
    );
    expect(result[1]).toEqual([{ path: 'code', type: 'set', value: '123456' }]);
});

test('should reduce changes to liquid state', () => {
    const patch: PatchOperation[] = [
        { path: 'tags', type: 'add', item: TagLiquid },
        { path: 'servings.g', type: 'unset' },
        { path: 'servings.ml', type: 'set', value: 1 },
        { path: 'defaultServing', type: 'set', value: 'ml' },
        { path: 'code', type: 'set', value: '123456' },
    ];

    const result = itiriri(reducePatch(arrayToGenerator(patch))).toArray();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(
        jasmine.arrayContaining([
            { path: 'tags', type: 'add', item: TagLiquid },
            { path: 'servings.g', type: 'unset' },
            { path: 'servings.ml', type: 'set', value: 1 },
            { path: 'defaultServing', type: 'set', value: 'ml' },
        ]),
    );
    expect(result[1]).toEqual([{ path: 'code', type: 'set', value: '123456' }]);
});

test('should reduce changes to nutrition information', () => {
    const patch: PatchOperation[] = [
        { path: 'nutritionalInformation.energy', type: 'set', value: 500 },
        { path: 'code', type: 'set', value: '123456' },
    ];

    const result = itiriri(reducePatch(arrayToGenerator(patch))).toArray();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual([{ path: 'nutritionalInformation.energy', type: 'set', value: 500 }]);
    expect(result[1]).toEqual([{ path: 'code', type: 'set', value: '123456' }]);
});

test('should reduce changes to nutrition information', () => {
    const patch: PatchOperation[] = [
        { path: 'nutritionalInformation.energy', type: 'set', value: 500 },
        { path: 'nutritionalInformation.protein', type: 'set', value: 23 },
        { path: 'code', type: 'set', value: '123456' },
    ];

    const result = itiriri(reducePatch(arrayToGenerator(patch))).toArray();

    expect(result.length).toBe(2);
    expect(result[0]).toEqual(
        jasmine.arrayContaining([
            { path: 'nutritionalInformation.energy', type: 'set', value: 500 },
            { path: 'nutritionalInformation.protein', type: 'set', value: 23 },
        ]),
    );
    expect(result[1]).toEqual([{ path: 'code', type: 'set', value: '123456' }]);
});
