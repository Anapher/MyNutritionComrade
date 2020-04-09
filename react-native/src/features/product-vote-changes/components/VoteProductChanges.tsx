import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Color from 'color';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { Surface, useTheme, Text } from 'react-native-paper';
import { connect } from 'react-redux';
import getPatchView from 'src/features/product-create/components/patch/get-patch-view';
import OperationHeader from 'src/features/product-create/components/patch/OperationHeader';
import { RootStackParamList } from 'src/RootNavigator';
import * as actions from '../actions';
import VoteButtons from './VoteChangeButtons';
import _ from 'lodash';

const mapStateToProps = (state: RootState) => ({
    changes: state.voteProductChanges.changes,
    product: state.voteProductChanges.product,
    pendingVotes: state.voteProductChanges.pendingVotes,
});

const dispatchProps = {
    init: actions.init,
    vote: actions.voteContribution.request,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        navigation: StackNavigationProp<RootStackParamList>;
        route: RouteProp<RootStackParamList, 'VoteProductChanges'>;
    };

function VoteProductChanges({
    init,
    vote,
    changes,
    route: {
        params: { contributions, product },
    },
    pendingVotes,
}: Props) {
    useEffect(() => {
        init({ contributions, product });
    }, [contributions]);

    const { colors } = useTheme();

    const changeViews = useMemo(
        () =>
            changes &&
            _.orderBy(changes, [(x) => x.vote !== null, (x) => x.createdOn], ['asc', 'desc']).map((contribution) => ({
                ...getPatchView({ currentProduct: product, patchOperation: contribution.patch }),
                contribution,
            })),
        [product, changes],
    );

    if (changeViews == null) {
        return null;
    }

    const background = Color(colors.background).lighten(1).string();

    return (
        <FlatList
            data={changeViews}
            keyExtractor={(x) => x.contribution.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item: { contribution, propertyName, type, view } }) => (
                <View key={contribution.id} style={[styles.card, { backgroundColor: background }]}>
                    <View>
                        <Surface style={[styles.cardHeader]}>
                            <OperationHeader propertyName={propertyName} type={type} />
                        </Surface>
                        <View style={styles.row}>
                            <View style={styles.cardContent}>{view}</View>
                            <VoteButtons
                                contribution={contribution}
                                pendingVote={pendingVotes.find((x) => x.id === contribution.id)?.approve}
                                onVote={(approve) => vote({ productContributionId: contribution.id, approve })}
                            />
                        </View>
                        {contribution.isContributionFromUser && (
                            <Text style={styles.contributionFromUserText}>
                                This contribution was made by you. Thank you ❤
                            </Text>
                        )}
                    </View>
                </View>
            )}
        ></FlatList>
    );
}

const styles = StyleSheet.create({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    separator: {
        marginBottom: 8,
        marginTop: 8,
    },
    card: {},
    cardHeader: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        elevation: 14,
    },
    cardContent: {
        paddingVertical: 16,
        paddingLeft: 16,
        paddingRight: 16,
        flex: 1,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    contributionFromUserText: {
        fontSize: 12,
        paddingLeft: 16,
        paddingBottom: 8,
        marginTop: -8,
        color: '#7f8c8d',
    },
});

export default connect(mapStateToProps, dispatchProps)(VoteProductChanges);
