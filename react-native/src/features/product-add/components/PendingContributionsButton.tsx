import Color from 'color';
import { ProductContributionDto } from 'Models';
import React from 'react';
import { StyleSheet } from 'react-native';
import FlatButton from 'src/components/FlatButton';

function PendingContributionsButton({ pending, onPress }: { pending: ProductContributionDto[]; onPress: () => void }) {
    const voteChanges = pending.filter((x) => !x.vote);

    let text = '';
    if (voteChanges.length > 0) {
        text = `${voteChanges.length} change${voteChanges.length > 1 ? 's' : ''} to vote`;
    } else {
        text = `${pending.length} pending change${pending.length > 1 ? 's' : ''}`;
    }

    return (
        <FlatButton
            style={[styles.bottomButton, voteChanges.length > 0 && styles.highlightedButton]}
            text={text}
            icon="poll-box"
            onPress={onPress}
            center
        />
    );
}

const styles = StyleSheet.create({
    bottomButton: {
        flex: 1,
    },
    highlightedButton: {
        backgroundColor: Color('#e67e22').alpha(0.3).string(),
    },
});

export default PendingContributionsButton;
