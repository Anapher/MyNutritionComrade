import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import TextToggleButton from 'src/components/TextToggleButton';
import _ from 'lodash';
import { ProductSearchDto } from 'Models';
import { TagLiquid } from 'src/consts';
import { Text, Caption } from 'react-native-paper';
import { capitalizeFirstLetter } from 'src/utils/string-utils';

type Props = {
    value: string;
    onChange: (v: string) => void;
    product: ProductSearchDto;
};

export default function ServingSelection({ value, onChange, product }: Props) {
    const [servingModels, setServingModels] = useState<string[]>([]);

    useEffect(() => {
        setServingModels(_.sortBy(Object.keys(product.servings), (x) => product.servings[x]));
    }, [product]);

    return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            {servingModels.map((x, i) => (
                <TextToggleButton
                    key={x}
                    isChecked={value === x}
                    isLeft={i === 0}
                    isRight={i === servingModels.length - 1}
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
    );
}
