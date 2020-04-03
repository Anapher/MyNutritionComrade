import _ from 'lodash';
import { PatchOperation, ProductInfo, ProductLabel, OpRemoveItem, OpAddItem } from 'Models';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ChangedValue from 'src/components/ChangedValue';
import ReadOnlyTable, { ReadOnlyTableRow } from 'src/components/ReadOnlyTable';
import { formatNumber } from 'src/utils/string-utils';
import { nutritionalInfo, getServings, ServingInfo } from '../../data';
import { TagLiquid } from 'src/consts';
import { Text as PaperText } from 'react-native-paper';
import { isProductLiquid, getBaseUnit } from 'src/utils/product-utils';
import ValuePatch from './ValuePatch';
import { OperationType } from './OperationHeader';

export type PatchView = {
    type: OperationType;
    propertyName: string;
    view: React.ReactNode;
};

type Props = {
    patchOperation: PatchOperation[];
    currentProduct: ProductInfo;
};

function getPatchView(props: Props): PatchView {
    const { patchOperation, currentProduct } = props;

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
                        <View style={styles.linearView}>
                            <Text>Default Serving: </Text>
                            <ValuePatch<string> patch={defaultServingOp} currentValue={currentProduct.defaultServing} />
                        </View>
                    )}
                    {servingsOp.map((x) => (
                        <View style={styles.linearView} key={x.path}>
                            <Text>Serving: </Text>
                            <ValuePatch<number>
                                patch={x}
                                currentValue={currentProduct.servings[x.path.substring(x.path.indexOf('.') + 1)]}
                                formatValue={(v) =>
                                    currentProduct.servings[x.path.substring(x.path.indexOf('.') + 1)] + ': ' + v
                                }
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
            view: <ValuePatch<string> patch={patch} currentValue={currentProduct.code} />,
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

    if (patch.path === 'label') {
        if (patchOperation.length === 2) {
            // replace
            const removeOp = patchOperation.find((x) => x.type === 'remove') as OpRemoveItem;
            const addOp = patchOperation.find((x) => x.type === 'add') as OpAddItem;

            return {
                type: 'modify',
                propertyName: `Label (Language: ${(addOp.item as ProductLabel).languageCode})`,
                view: (
                    <View style={styles.linearView}>
                        <ChangedValue
                            removed
                            value={(removeOp.item as ProductLabel).value}
                            style={{ marginRight: patch.type === 'set' ? 2 : 0 }}
                        />
                        <ChangedValue
                            value={(addOp.item as ProductLabel).value}
                            style={{ marginRight: patch.type === 'set' ? 2 : 0 }}
                        />
                    </View>
                ),
            };
        }
        if (patchOperation.length === 1) {
            if (patch.type === 'add') {
                return {
                    type: 'add',
                    propertyName: `Label (Language: ${(patch.item as ProductLabel).languageCode})`,
                    view: <ChangedValue value={(patch.item as ProductLabel).value} />,
                };
            }
            if (patch.type === 'remove') {
                return {
                    type: 'remove',
                    propertyName: `Label (Language: ${(patch.item as ProductLabel).languageCode})`,
                    view: <ChangedValue removed value={(patch.item as ProductLabel).value} />,
                };
            }
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
    const data = patchOperation.map((patch) => ({
        patch,
        info: nutritionalInfo.find((x) => x.name === extractName(patch))!,
    }));

    return (
        <ReadOnlyTable>
            {_.sortBy(data, (x) => nutritionalInfo.indexOf(x.info)).map(({ patch, info }) => (
                <ReadOnlyTableRow label={info.label}>
                    <ValuePatch<number>
                        patch={patch}
                        currentValue={currentProduct.nutritionalInfo[info.name]}
                        formatValue={(x) => formatNumber(x, 2) + info.unit}
                    />
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
