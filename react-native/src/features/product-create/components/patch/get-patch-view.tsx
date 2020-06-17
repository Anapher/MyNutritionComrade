import { PatchOperation, ProductLabel, ProductProperties } from 'Models';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Text as PaperText } from 'react-native-paper';
import ChangedValue from 'src/components/ChangedValue';
import ReadOnlyTable, { ReadOnlyTableRow } from 'src/components/ReadOnlyTable';
import { TagLiquid } from 'src/consts';
import ProductOverview from 'src/features/product-overview/components/ProductOverview';
import { getBaseUnit, isProductLiquid } from 'src/utils/product-utils';
import { formatNumber } from 'src/utils/string-utils';
import { getServings, nutritionalInfo, NutritionRow, ServingInfo } from '../../data';
import { applyPatch } from '../../utils';
import { OperationType } from './OperationHeader';
import ValuePatch from './ValuePatch';

export type PatchView = {
    type: OperationType;
    propertyName: string;
    view: React.ReactNode;
};

type Props = {
    patchOperation: PatchOperation[];
    currentProduct: ProductProperties;
};

function getPatchView(props: Props): PatchView {
    const { patchOperation, currentProduct } = props;

    // if both a label set and a nutritional info set operation exist in this operation
    // we have an initialization, as they would've been splitted to two separate operations else
    if (
        patchOperation.find((x) => x.path.startsWith('label')) &&
        patchOperation.find((x) => x.path === 'nutritionalInfo.energy')
    ) {
        const product: ProductProperties = {
            servings: {},
            label: {},
            tags: [],
            nutritionalInfo: {
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
            defaultServing: '',
        };

        applyPatch(product, patchOperation);

        return {
            type: 'initialize',
            propertyName: 'Initialize Product',
            view: <ProductOverview product={product} />,
        };
    }

    if (
        patchOperation.find(
            (x) => x.path === 'tags' && (x.type === 'add' || x.type === 'remove') && x.item === TagLiquid,
        )
    ) {
        const tagOp = patchOperation.find((x) => x.path === 'tags')!;
        const servingsOp = patchOperation.filter((x) => x.path.startsWith('servings'))!;
        const defaultServingOp = patchOperation.find((x) => x.path === 'defaultServing');

        const transitionsToLiquid = tagOp.type === 'add';

        return {
            type: 'modify',
            propertyName: transitionsToLiquid ? 'Make product a liquid' : 'Revoke liquid status',
            view: (
                <View>
                    {defaultServingOp && (
                        <View style={[styles.linearView, { marginBottom: 4 }]}>
                            <PaperText>Default Serving: </PaperText>
                            <ValuePatch<string> patch={defaultServingOp} currentValue={currentProduct.defaultServing} />
                        </View>
                    )}
                    {servingsOp.map((x) => (
                        <View style={[styles.linearView, { marginBottom: 4 }]} key={x.path}>
                            <PaperText>Serving: </PaperText>
                            <ValuePatch<number>
                                patch={x}
                                currentValue={currentProduct.servings[x.path.substring(x.path.indexOf('.') + 1)]}
                                formatValue={(v) => x.path.substring(x.path.indexOf('.') + 1) + ': ' + v}
                            />
                        </View>
                    ))}
                </View>
            ),
        };
    }

    const patch = patchOperation[0];
    if (patch.path.startsWith('nutritionalInfo.')) {
        return {
            type: 'modify',
            propertyName: 'Nutritional Information',
            view: <NutritionalInfo {...props} />,
        };
    }

    if (patch.path === 'code') {
        return {
            type: getPropertyOperationType(patch, currentProduct.code),
            propertyName: 'Barcode',
            view: <ValuePatch<string> patch={patch} currentValue={currentProduct.code || undefined} />,
        };
    }

    if (patch.path === 'defaultServing') {
        return {
            type: getPropertyOperationType(patch, currentProduct.defaultServing),
            propertyName: 'Default Serving',
            view: <ValuePatch<string> patch={patch} currentValue={currentProduct.defaultServing} />,
        };
    }

    if (patch.path.startsWith('servings')) {
        const name = patch.path.substring(patch.path.indexOf('.') + 1);
        const servings = getServings(isProductLiquid(currentProduct)) as { [x: string]: ServingInfo };
        const unit = getBaseUnit(currentProduct);

        return {
            type: getPropertyOperationType(patch, currentProduct.servings[name]),
            propertyName: 'Servings',
            view: (
                <View style={styles.linearView}>
                    <PaperText>{servings[name].label}: </PaperText>
                    <ValuePatch<number>
                        patch={patch}
                        currentValue={currentProduct.servings[name]}
                        formatValue={(x) => x + unit}
                    />
                </View>
            ),
        };
    }

    if (patch.path.startsWith('label.')) {
        const splitter = patch.path.split('.');
        const language = splitter[1];
        const prop = splitter.length > 2 ? splitter[2] : undefined;

        const currentLabel = currentProduct.label[language];

        if (prop) {
            if (prop === 'value') {
                return {
                    type: 'modify',
                    propertyName: `Label value (Language: ${language})`,
                    view: (
                        <Text>
                            {currentLabel && <ChangedValue removed value={currentLabel.value} />}
                            <Text>{'   '}</Text>
                            {patch.type === 'set' && <ChangedValue value={patch.value} />}
                        </Text>
                    ),
                };
            }

            if (prop === 'tags') {
                return {
                    type: 'modify',
                    propertyName: `Label tags (Language: ${language})`,
                    view: (
                        <Text>
                            {currentLabel && <ChangedValue removed value={currentLabel.tags.join(', ')} />}
                            <Text>{'   '}</Text>
                            {patch.type === 'set' && <ChangedValue value={patch.value} />}
                        </Text>
                    ),
                };
            }

            return {
                type: 'modify',
                propertyName: `Label (Language: ${language})`,
                view: <Text>Unknown Prop. Please contact the developer</Text>,
            };
        }

        if (patch.type === 'set') {
            // replace
            const newLabel = patch.value as ProductLabel;

            return {
                type: 'add',
                propertyName: `Label (Language: ${language})`,
                view: (
                    <Text>
                        <ChangedValue value={newLabel.value} />
                        <Text>Tags:</Text>
                        <ChangedValue value={newLabel.tags.join(', ')} />
                    </Text>
                ),
            };
        }

        if (patch.type === 'unset') {
            return {
                type: 'remove',
                propertyName: `Label (Language: ${language})`,
                view: (
                    <Text>
                        <ChangedValue removed value={currentProduct.label[language]?.value} />
                        <Text>Tags:</Text>
                        <ChangedValue removed value={currentProduct.label[language]?.tags.join(', ')} />
                    </Text>
                ),
            };
        }
    }

    return {
        type: 'modify',
        propertyName: patch.path,
        view: <Text>{JSON.stringify(patchOperation)}</Text>,
    };
}

function NutritionalInfo({ patchOperation, currentProduct }: Props) {
    const extractName = (patch: PatchOperation) => patch.path.substring(patch.path.indexOf('.') + 1);
    const rowView = (row: NutritionRow) => {
        const patch = patchOperation.find((x) => extractName(x) === row.name);
        const currentValue = currentProduct.nutritionalInfo[row.name];
        const formatValue = (n: number) => formatNumber(n, 2) + row.unit;

        return patch ? (
            <ValuePatch<number> patch={patch} currentValue={currentValue} formatValue={formatValue} />
        ) : (
            <PaperText>{formatValue(currentValue)}</PaperText>
        );
    };

    return (
        <ReadOnlyTable>
            {nutritionalInfo.map((x, i) => (
                <ReadOnlyTableRow
                    showDivider={i > 0}
                    alternate={i % 2 === 1}
                    label={x.label}
                    key={x.name}
                    inset={x.inset}
                >
                    {rowView(x)}
                </ReadOnlyTableRow>
            ))}
        </ReadOnlyTable>
    );
}

const getPropertyOperationType = (op: PatchOperation, currentValue: any): OperationType => {
    if (op.type === 'add') return 'add';
    if (op.type === 'remove') return 'remove';

    if (currentValue) {
        if (op.type === 'unset') return 'remove';
        else return 'modify';
    } else {
        if (op.type === 'set') return 'add';
        return 'modify'; // that should actually not happen
    }
};

const styles = StyleSheet.create({
    linearView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
export default getPatchView;
