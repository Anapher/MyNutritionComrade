import _ from 'lodash';
import { PatchOperation, ProductInfo } from 'Models';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ChangedValue from 'src/components/ChangedValue';
import ReadOnlyTable, { ReadOnlyTableRow } from 'src/components/ReadOnlyTable';
import { formatNumber } from 'src/utils/string-utils';
import { nutritionalInfo, getServings, ServingInfo } from '../data';
import { TagLiquid } from 'src/consts';
import { Text as PaperText } from 'react-native-paper';
import { isProductLiquid } from 'src/utils/product-utils';

const styles = StyleSheet.create({
    chip: {
        borderRadius: 10,
        borderWidth: 0,
        paddingHorizontal: 8,
        paddingVertical: 2,
        width: 60,
        display: 'flex',
        alignItems: 'center',
    },
    chipText: {
        color: 'white',
        fontSize: 12,
    },
    operationHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    operationHeaderPropertyName: {
        marginLeft: 8,
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.5,
    },
    linearView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

type OperationType = 'add' | 'modify' | 'remove';
const operationTypeStyles: {
    [key in OperationType]: {
        title: string;
        color: string;
    };
} = {
    add: {
        title: 'Add',
        color: '#27ae60',
    },
    remove: {
        title: 'Remove',
        color: '#c0392b',
    },
    modify: {
        title: 'Modify',
        color: '#2980b9',
    },
};

function OperationHeader({ type, propertyName }: { type: OperationType; propertyName: string }) {
    return (
        <View style={styles.operationHeader}>
            <View style={[styles.chip, { backgroundColor: operationTypeStyles[type].color }]}>
                <Text style={styles.chipText}>{operationTypeStyles[type].title}</Text>
            </View>
            <Text style={styles.operationHeaderPropertyName}>{propertyName}</Text>
        </View>
    );
}

type Props = {
    patchOperation: PatchOperation[];
    currentProduct: ProductInfo;
};

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
                        currentValue={currentProduct.nutritionalInformation[info.name]}
                        formatValue={(x) => formatNumber(x, 2) + info.unit}
                    />
                </ReadOnlyTableRow>
            ))}
        </ReadOnlyTable>
    );
}

function ValuePatch<T>({
    patch,
    currentValue,
    formatValue,
}: {
    patch: PatchOperation;
    currentValue?: T;
    formatValue?: (x: T) => string;
}) {
    return (
        <View style={{ display: 'flex', flexDirection: 'row' }}>
            {currentValue && (
                <ChangedValue
                    value={formatValue ? formatValue(currentValue) : String(currentValue)}
                    style={{ marginRight: patch.type === 'set' ? 2 : 0 }}
                />
            )}
            {patch.type === 'set' && <ChangedValue value={formatValue ? formatValue(patch.value) : patch.value} />}
        </View>
    );
}

function StringArrayChanges({ patchOperation, currentProduct }: Props) {}

function PatchChanges(props: Props) {
    const { patchOperation, currentProduct } = props;

    if (
        patchOperation.findIndex(
            (x) => x.path === 'tags' && (x.type === 'add' || x.type === 'remove') && x.item === TagLiquid,
        )
    ) {
    }

    const patch = patchOperation[0];
    if (patch.path.startsWith('nutritionalInformation.')) {
        return <NutritionalInfo {...props} />;
    }

    if (patch.path === 'code') {
        return <ValuePatch<string> patch={patch} currentValue={currentProduct.code} />;
    }

    if (patch.path === 'defaultServing') {
        return <ValuePatch<string> patch={patch} currentValue={currentProduct.defaultServing} />;
    }

    if (patch.path.startsWith('servings')) {
        const name = patch.path.substring(patch.path.indexOf('.') + 1);
        const servings = getServings(isProductLiquid(currentProduct)) as { [x: string]: ServingInfo };
        return (
            <View style={styles.linearView}>
                <PaperText>{servings[name].label}: </PaperText>
                <ValuePatch<number> patch={patch} currentValue={currentProduct.servings[name]} />
            </View>
        );
    }

    if (patch.path === 'label') {
        // TODO
    }
}

export default function PatchOperationView({ patchOperation }: Props) {
    return (
        <View>
            <OperationHeader type="modify" propertyName="Servings" />
        </View>
    );
}
