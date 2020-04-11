import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Color from 'color';
import _ from 'lodash';
import { ProductContributionStatus } from 'Models';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Dialog, Portal, Surface, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import DialogRadioButton from 'src/components/DialogRadioButton';
import ListFooterLoadMore from 'src/components/ListFooterLoadMore';
import getPatchView from 'src/features/product-create/components/patch/get-patch-view';
import OperationHeader from 'src/features/product-create/components/patch/OperationHeader';
import { RootStackParamList } from 'src/RootNavigator';
import * as actions from '../actions';
import VoteButtons from './VoteChangeButtons';

const mapStateToProps = (state: RootState) => ({
    changes: state.voteProductChanges.changes,
    pendingVotes: state.voteProductChanges.pendingVotes,
    isLoading: state.voteProductChanges.isLoading,
    filter: state.voteProductChanges.filter,
    totalChanges: state.voteProductChanges.totalChanges,
});

const dispatchProps = {
    init: actions.init,
    vote: actions.voteContribution.request,
    loadContributions: actions.loadContributions.request,
    loadedContributions: actions.loadContributions.success,
    loadNext: actions.loadNextContributions.request,
};

type Props = ReturnType<typeof mapStateToProps> &
    typeof dispatchProps & {
        navigation: StackNavigationProp<RootStackParamList>;
        route: RouteProp<RootStackParamList, 'VoteProductChanges'>;
    };

const filters: (ProductContributionStatus | null)[] = [null, 'pending', 'applied', 'rejected'];
const getFilterLabel = (filter: ProductContributionStatus | null) => {
    switch (filter) {
        case null:
            return 'All';
        case 'pending':
            return 'Pending';
        case 'applied':
            return 'Applied';
        case 'rejected':
            return 'Rejected';
    }
};

function VoteProductChanges({
    init,
    vote,
    changes,
    route: {
        params: { preloaded, product, filter },
    },
    navigation,
    pendingVotes,
    loadContributions,
    loadedContributions,
    isLoading,
    loadNext,
    filter: selectedFilter,
    totalChanges,
}: Props) {
    useEffect(() => {
        init(product);

        if (preloaded === undefined) {
            loadContributions({ productId: product.id, filter });
        } else {
            loadedContributions({ productId: product.id, filter, response: preloaded });
        }
    }, [product]);

    const { colors } = useTheme();
    const changeViews = useMemo(
        () =>
            changes &&
            (selectedFilter === 'pending'
                ? _.orderBy(changes, [(x) => x.vote !== null, (x) => x.createdOn], ['asc', 'desc'])
                : changes
            ).map((contribution) => ({
                ...getPatchView({ currentProduct: product, patchOperation: contribution.patch }),
                contribution,
            })),
        [product, changes],
    );

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };
    const handleCancelDialog = () => setIsDialogOpen(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            header: () => (
                <Appbar.Header>
                    <Appbar.BackAction onPress={navigation.goBack} />
                    <Appbar.Content title="Product Changes" />
                    <Appbar.Action icon="filter-variant" onPress={handleOpenDialog} />
                </Appbar.Header>
            ),
        });
    });

    if (changeViews == null) {
        return null;
    }
    if (changeViews.some((x) => x.contribution.productId !== product.id)) {
        return null;
    }

    const background = Color(colors.background).lighten(1).string();

    return (
        <>
            <FlatList
                refreshing={isLoading}
                onRefresh={() => loadContributions({ productId: product.id, filter })}
                data={changeViews}
                keyExtractor={(x) => x.contribution.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListFooterComponent={() =>
                    totalChanges > (changes?.length || 0) ? (
                        <ListFooterLoadMore text="Load more" onPress={() => loadNext()} isLoading={isLoading} />
                    ) : null
                }
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
            />
            <Portal>
                <Dialog visible={isDialogOpen} onDismiss={handleCancelDialog}>
                    <Dialog.Title>Filter</Dialog.Title>
                    <Dialog.ScrollArea>
                        <ScrollView>
                            <View>
                                {filters.map((x) => (
                                    <DialogRadioButton
                                        checked={selectedFilter === x}
                                        key={x || 'null'}
                                        label={getFilterLabel(x)}
                                        onPress={() => {
                                            loadContributions({ productId: product.id, filter: x || undefined });
                                            setIsDialogOpen(false);
                                        }}
                                    />
                                ))}
                            </View>
                        </ScrollView>
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button onPress={handleCancelDialog}>Cancel</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
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
