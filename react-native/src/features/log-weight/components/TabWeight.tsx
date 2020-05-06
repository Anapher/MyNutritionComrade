import { DateTime } from 'luxon';
import { LoggedWeight } from 'Models';
import { RootState } from 'MyNutritionComrade';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Divider, FAB } from 'react-native-paper';
import { connect } from 'react-redux';
import LoadingOverlay from 'src/components/LoadingOverlay';
import useAsyncFunction from 'src/hooks/use-async-function';
import * as actions from '../actions';
import EntryOptionsDialog from './EntryOptionsDialog';
import LoggedWeightItem from './LoggedWeightItem';
import LogWeightDialog from './LogWeightDialog';

const mapStateToProps = (state: RootState) => ({
    isLoading: state.logWeight.isLoading,
    data: state.logWeight.loggedWeights,
});

const dispatchProps = {
    loadData: actions.loadLoggedWeight.request,
    addData: actions.addLoggedWeight.request,
};

type Props = ReturnType<typeof mapStateToProps> & typeof dispatchProps;

function TabWeight({ loadData, data }: Props) {
    useEffect(() => {
        loadData();
    }, []);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [openedEntry, setOpenedEntry] = useState<LoggedWeight | undefined>();

    const addAction = useAsyncFunction(
        actions.addLoggedWeight.request,
        actions.addLoggedWeight.success,
        actions.addLoggedWeight.failure,
    );

    const removeAction = useAsyncFunction(
        actions.removeLoggedWeight.request,
        actions.removeLoggedWeight.success,
        actions.removeLoggedWeight.failure,
    );

    if (data === null) {
        return <LoadingOverlay info="Loading history..." />;
    }

    return (
        <View style={styles.root}>
            <FlatList
                data={data}
                style={styles.root}
                renderItem={({ item }) => <LoggedWeightItem data={item} onOptions={() => setOpenedEntry(item)} />}
                keyExtractor={(x) => x.timestamp}
                ListHeaderComponent={<View style={{ backgroundColor: 'gray', height: 200 }} />}
                ItemSeparatorComponent={() => <Divider />}
            />
            <FAB style={styles.fab} icon="plus" onPress={() => setDialogOpen(true)} />
            <LogWeightDialog
                open={dialogOpen}
                onDismiss={() => setDialogOpen(false)}
                onSubmit={(value) => addAction!({ value, timestamp: DateTime.local().toISO() })}
            />
            <EntryOptionsDialog
                entry={openedEntry}
                onDismiss={() => setOpenedEntry(undefined)}
                onRemove={(x) => removeAction!(x.timestamp)}
            />
        </View>
    );
}

export default connect(mapStateToProps, dispatchProps)(TabWeight);

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
