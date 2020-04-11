import itiriri from 'itiriri';
import _ from 'lodash';
import { OpAddItem, OpRemoveItem, PatchOperation, ProductProperties } from 'Models';
import { TagLiquid } from 'src/consts';
import levenshteinDistance from 'src/utils/levenshtein-distance';

export function* createPatch(source: any, target: any, path: string = ''): Generator<PatchOperation> {
    for (const key of Object.keys(target)) {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (targetValue === sourceValue) {
            continue;
        }

        if (typeof targetValue !== typeof sourceValue) {
            yield { type: 'set', path: path + key, value: targetValue };
            continue;
        }

        if (Array.isArray(targetValue)) {
            if (!Array.isArray(sourceValue)) {
                yield { type: 'set', path: path + key, value: targetValue };
                continue;
            }

            // added items
            for (const item of targetValue.filter(
                (x) => sourceValue.findIndex((y) => compareObjectProperties(x, y)) === -1,
            )) {
                yield { type: 'add', path: path + key, item };
            }

            // removed items
            for (const item of sourceValue.filter(
                (x) => targetValue.findIndex((y) => compareObjectProperties(x, y)) === -1,
            )) {
                yield { type: 'remove', path: path + key, item };
            }

            continue;
        }

        if (typeof targetValue === 'function') continue;

        if (typeof targetValue === 'object') {
            yield* createPatch(sourceValue, targetValue, path + key + '.');
            continue;
        }

        if (targetValue !== sourceValue) {
            yield { type: 'set', path: path + key, value: targetValue };
        }
    }

    for (const sourceKey of Object.keys(source)) {
        if (target[sourceKey] === undefined) {
            yield { type: 'unset', path: path + sourceKey };
        }
    }
}

export function* reducePatch(patch: Generator<PatchOperation>): Generator<PatchOperation[], any, undefined> {
    const ops = itiriri(patch).toArray();

    // find replaced labels
    if (ops.filter((x) => x.path === 'label').length > 1) {
        for (const o of ops.filter((x) => x.path === 'label' && x.type === 'add')) {
            const addedLabel: OpAddItem = o as OpAddItem;

            const possibleReplacedElements: OpRemoveItem[] = ops.filter(
                (x) =>
                    x.path === 'label' &&
                    x.type === 'remove' &&
                    x.item.languageCode === (addedLabel as OpAddItem).item.languageCode,
            ) as OpRemoveItem[];

            if (possibleReplacedElements.length > 0) {
                const replacedElement = _.sortBy(possibleReplacedElements, (x) =>
                    levenshteinDistance(x.item.value, addedLabel.item.value),
                )[0];

                ops.splice(ops.indexOf(addedLabel), 1);
                ops.splice(ops.indexOf(replacedElement), 1);

                // replace
                yield [replacedElement, addedLabel];
            }
        }
    }

    // combine anything that has to do with the liquid tag change
    const liquidTagOp = moveItemIfFound(
        ops,
        [],
        (x) => x.path === 'tags' && (x.type === 'add' || x.type === 'remove') && x.item === TagLiquid,
    );

    if (liquidTagOp !== undefined) {
        const operations: PatchOperation[] = [liquidTagOp];

        const newUnit = liquidTagOp.type === 'add' ? 'ml' : 'g';
        const oldUnit = liquidTagOp.type === 'add' ? 'g' : 'ml';

        moveItemIfFound(ops, operations, (x) => x.path === `servings.${newUnit}`);
        moveItemIfFound(ops, operations, (x) => x.path === `servings.${oldUnit}`);
        moveItemIfFound(ops, operations, (x) => x.path === 'defaultServing' && x.type === 'set' && x.value === newUnit);

        yield operations;
    }

    // combine all changes made to nutrition info
    const nutritionInfoChanges = ops.filter((x) => x.path.startsWith('nutritionalInfo.'));
    if (nutritionInfoChanges.length > 0) {
        for (const op of nutritionInfoChanges) ops.splice(ops.indexOf(op), 1);
        yield nutritionInfoChanges;
    }

    yield* itiriri(ops).map((x) => [x]);
}

export function applyPatch(product: ProductProperties, patches: PatchOperation[]) {
    const o = product as any;

    for (const patch of patches) {
        switch (patch.type) {
            case 'set': {
                const { parent, propName } = extractPathParent(o, patch.path);
                parent[propName] = patch.value;
                break;
            }
            case 'unset': {
                const { parent, propName } = extractPathParent(o, patch.path);
                parent[propName] = undefined;
                break;
            }
            case 'add': {
                const array = extractPathObject(o, patch.path) as any[];
                array.push(patch.item);
                break;
            }
            case 'remove': {
                const array = extractPathObject(o, patch.path) as any[];
                const existing = array.findIndex((x) => compareObjectProperties(x, patch.item));
                if (existing !== -1) array.splice(existing, 1);
                break;
            }
        }
    }
}

function extractPathObject(o: any, path: string): any {
    const segments = path.split('.');
    let currentObject = o;
    for (const s of segments) {
        currentObject = currentObject[s];
    }

    return currentObject;
}

function extractPathParent(o: any, path: string): { parent: any; propName: string } {
    const segments = path.split('.');
    let currentObject = o;
    for (let i = 0; i < segments.length - 1; i++) {
        const s = segments[i];
        currentObject = currentObject[s];
    }

    return { parent: currentObject, propName: segments[segments.length - 1] };
}

function moveItemIfFound<T>(
    items: T[],
    target: T[],
    predicate: (value: T, index: number, obj: T[]) => boolean,
): T | undefined {
    const item = items.find(predicate);
    if (item !== undefined) {
        items.splice(items.indexOf(item), 1);
        target.push(item);
        return item;
    }

    return undefined;
}

function compareObjectProperties(p1: any, p2: any) {
    for (const key in p1) {
        if (p1.hasOwnProperty(key)) {
            if (p1[key] !== p2[key]) return false;
        }
    }

    return true;
}
