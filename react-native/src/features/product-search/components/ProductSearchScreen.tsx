import { RootState } from 'MyNutritionComrade';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';
import { connect } from 'react-redux';
import SuggestionItem from './SuggestionItem';

const mapStateToProps = (state: RootState) => ({
    suggestions: state.productSearch.suggestions,
});

type Props = ReturnType<typeof mapStateToProps>;

function ProductSearchScreen({ suggestions }: Props) {
    return (
        <FlatList
            data={suggestions}
            ItemSeparatorComponent={() => <Divider inset />}
            renderItem={item => <SuggestionItem item={item.item} />}
        />
    );
}

export default connect(mapStateToProps)(ProductSearchScreen);
