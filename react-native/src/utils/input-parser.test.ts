import { tryParseServingSize } from 'src/utils/input-parser';

test('should parse "5" correctly', () => {
    const input = '5';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBeUndefined();

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(5);
    expect(serving!.unit).toBeUndefined();
});

test('should parse "5g" correctly', () => {
    const input = '5g';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBeUndefined();

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(5);
    expect(serving!.unit).toBe('g');
});

test('should parse "5 sl" correctly', () => {
    const input = '5 sl';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBeUndefined();

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(5);
    expect(serving!.unit).toBe('slice');
});

test('should parse "kg" correctly', () => {
    const input = 'kg';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBeUndefined();

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(0);
    expect(serving!.unit).toBe('g');
    expect(serving!.convertedFrom).toBeDefined();
    expect(serving!.convertedFrom!.factor).toBe(1000);
    expect(serving!.convertedFrom!.name).toBe('kg');
});

test('should parse "kg Kartoffeln" correctly', () => {
    const input = 'kg Kartoffeln';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBe('Kartoffeln');

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(0);
    expect(serving!.unit).toBe('g');
    expect(serving!.convertedFrom).toBeDefined();
    expect(serving!.convertedFrom!.factor).toBe(1000);
    expect(serving!.convertedFrom!.name).toBe('kg');
});

test('should parse "3kg Kartoffeln" correctly', () => {
    const input = '3kg Kartoffeln';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBe('Kartoffeln');

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(3);
    expect(serving!.unit).toBe('g');
    expect(serving!.convertedFrom).toBeDefined();
    expect(serving!.convertedFrom!.factor).toBe(1000);
    expect(serving!.convertedFrom!.name).toBe('kg');
});

test('should parse "3 kg Kartoffeln" correctly', () => {
    const input = '3 kg Kartoffeln';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBe('Kartoffeln');

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(3);
    expect(serving!.unit).toBe('g');
    expect(serving!.convertedFrom).toBeDefined();
    expect(serving!.convertedFrom!.factor).toBe(1000);
    expect(serving!.convertedFrom!.name).toBe('kg');
});

test('should parse ".5 kg Kartoffeln" correctly', () => {
    const input = '.5 kg Kartoffeln';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBe('Kartoffeln');

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(0.5);
    expect(serving!.unit).toBe('g');
    expect(serving!.convertedFrom).toBeDefined();
    expect(serving!.convertedFrom!.factor).toBe(1000);
    expect(serving!.convertedFrom!.name).toBe('kg');
});

test('should parse "0.5 kg Kartoffeln" correctly', () => {
    const input = '0.5 kg Kartoffeln';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBe('Kartoffeln');

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(0.5);
    expect(serving!.unit).toBe('g');
    expect(serving!.convertedFrom).toBeDefined();
    expect(serving!.convertedFrom!.factor).toBe(1000);
    expect(serving!.convertedFrom!.name).toBe('kg');
});

test('should parse "5 slices bread" correctly', () => {
    const input = '5 slices bread';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBe('bread');

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(5);
    expect(serving!.unit).toBe('slice');
    expect(serving!.convertedFrom).toBeUndefined();
});

test('should parse "potatoe" correctly', () => {
    const input = 'potatoe';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBe('potatoe');
    expect(result.serving).toBeUndefined();
});

test('should parse "200ml Milch" correctly', () => {
    const input = '200ml Milch';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBe('Milch');

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(200);
    expect(serving!.unit).toBe('l');
    expect(serving!.convertedFrom).toBeDefined();
    expect(serving!.convertedFrom!.factor).toBe(0.001);
    expect(serving!.convertedFrom!.name).toBe('ml');
});

test('should parse "200 Milch" correctly', () => {
    const input = '200 Milch';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBe('Milch');

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(200);
    expect(serving!.unit).toBeUndefined();
});

test('should parse "200ML Milch" correctly', () => {
    const input = '200ML Milch';
    const result = tryParseServingSize(input);

    expect(result.productSearch).toBe('Milch');

    const serving = result.serving && result.serving[0];
    expect(serving).toBeDefined();
    expect(serving!.amount).toBe(200);
    expect(serving!.unit).toBe('l');
    expect(serving!.convertedFrom).toBeDefined();
    expect(serving!.convertedFrom!.factor).toBe(0.001);
    expect(serving!.convertedFrom!.name).toBe('ml');
});
