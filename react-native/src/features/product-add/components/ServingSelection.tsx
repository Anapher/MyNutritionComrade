import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import TextToggleButton from 'src/components/TextToggleButton';
import _ from 'lodash';
import { ProductProperties } from 'Models';
import { TagLiquid } from 'src/consts';
import { Text, Caption } from 'react-native-paper';
import { capitalizeFirstLetter } from 'src/utils/string-utils';
import { createChunks } from 'src/utils/array-utils';

type Props = {
    value: string;
    onChange: (v: string) => void;
    product: ProductProperties;
};

export default function ServingSelection({ value, onChange, product }: Props) {
    const [servingModels, setServingModels] = useState<string[]>([]);

    useEffect(() => {
        setServingModels(_.sortBy(Object.keys(product.servings), (x) => product.servings[x]));
    }, [product]);

    return (
        <View>
            {createChunks(servingModels, 3).map((chunkItems, i) => (
                <View
                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: 8 }}
                    key={i}
                >
                    {chunkItems.map((x, i) => (
                        <TextToggleButton
                            key={x}
                            isChecked={value === x}
                            isLeft={i === 0}
                            isRight={i === chunkItems.length - 1}
                            onToggle={() => onChange(x)}
                            style={{ marginLeft: 2, width: 100, height: 40 }}
                        >
                            <Text>{x.length > 2 ? capitalizeFirstLetter(x) : x}</Text>
                            {product.servings[x] > 1 && (
                                <Caption style={{ marginVertical: 0, lineHeight: 14 }}>{`${product.servings[x]} ${
                                    product.tags.includes(TagLiquid) ? 'ml' : 'g'
                                }`}</Caption>
                            )}
                        </TextToggleButton>
                    ))}
                </View>
            ))}
        </View>
    );
}
