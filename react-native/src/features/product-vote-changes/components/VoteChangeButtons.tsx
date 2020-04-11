import { ProductContributionDto } from 'Models';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import AnimatedIconButton from 'src/components/AnimatedIconButton';
import { formatNumber } from 'src/utils/string-utils';
import Color from 'color';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    contribution: ProductContributionDto;
    onVote: (approve: boolean) => void;
    pendingVote?: boolean;
};

type ArrowButtonProps = {
    isUpvote?: boolean;
    existingVote?: boolean;
    pendingVote?: boolean;
    onVote: () => void;
    disabled?: boolean;
};

function ArrowButton({ isUpvote = false, existingVote, pendingVote, onVote, disabled }: ArrowButtonProps) {
    if (existingVote !== undefined && existingVote !== isUpvote) return null;
    if (pendingVote !== undefined && pendingVote !== isUpvote) return null;

    const voted = existingVote !== undefined;
    const isPending = pendingVote !== undefined;
    const iconName = isUpvote ? 'chevron-up' : 'chevron-down';
    const isDisabled = disabled || voted || isPending;

    return (
        <AnimatedIconButton
            name={iconName}
            size={56}
            color={disabled ? Color('#fff').alpha(0.1).string() : voted ? '#e74c3c' : 'white'}
            onPress={isDisabled ? undefined : onVote}
        />
    );
}

function VoteButtons({ contribution, onVote, pendingVote }: Props) {
    if (contribution.status === 'applied') {
        return (
            <View style={{ marginRight: 8, height: 120 }}>
                <Text style={[styles.statusText, styles.appliedText]}>Applied</Text>
            </View>
        );
    }

    if (contribution.status === 'rejected') {
        return (
            <View style={{ marginRight: 8, height: 140 }}>
                <Text style={[styles.statusText, styles.rejectedText]}>Rejected</Text>
            </View>
        );
    }

    return (
        <View style={styles.arrows}>
            <View style={{ height: 56 }}>
                <ArrowButton
                    disabled={contribution.isContributionFromUser}
                    isUpvote
                    existingVote={contribution.vote?.approve}
                    pendingVote={pendingVote}
                    onVote={() => onVote(true)}
                />
            </View>
            <Text style={styles.voteText}>{contribution.statistics.totalVotes}</Text>
            <View style={{ height: 56 }}>
                <ArrowButton
                    disabled={contribution.isContributionFromUser}
                    existingVote={contribution.vote?.approve}
                    pendingVote={pendingVote}
                    onVote={() => onVote(false)}
                />
            </View>
            {contribution.statistics.totalVotes > 0 && (
                <View style={styles.arrows}>
                    <Text style={styles.voteProportionText}>
                        {formatNumber(
                            (contribution.statistics.approveVotes / contribution.statistics.totalVotes) * 100,
                        )}
                        %
                    </Text>
                    <Text style={styles.voteProportionText}>approved</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    arrows: {
        alignItems: 'center',
    },
    voteText: {
        fontSize: 16,
        fontWeight: '700',
        marginVertical: -12,
    },
    voteProportionText: {
        fontSize: 9,
    },
    statusText: {
        textTransform: 'uppercase',
        transform: [{ rotate: '90deg' }, { translateX: 90 }],
        fontSize: 20,
        width: 200,
        letterSpacing: 5,
        marginHorizontal: -90,
        fontWeight: '700',
    },
    appliedText: {
        color: '#27ae60',
    },
    rejectedText: {
        color: '#e74c3c',
    },
});

export default VoteButtons;
