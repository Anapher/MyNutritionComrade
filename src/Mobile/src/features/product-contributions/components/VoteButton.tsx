import Color from 'color';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import AnimatedIconButton from 'src/components/AnimatedIconButton';

type Props = {
   isUpvote?: boolean;
   existingVote?: boolean;
   pendingVote?: boolean;
   onVote: () => void;
   disabled?: boolean;
   style?: StyleProp<ViewStyle>;
};

export default function VoteButton({ isUpvote = false, existingVote, pendingVote, onVote, disabled, style }: Props) {
   if (existingVote !== undefined && existingVote !== isUpvote) disabled = true;
   if (pendingVote !== undefined && pendingVote !== isUpvote) disabled = true;

   const voted = existingVote !== undefined;
   const isPending = pendingVote !== undefined;
   const iconName = isUpvote ? 'chevron-up' : 'chevron-down';
   const isDisabled = disabled || voted || isPending;

   return (
      <AnimatedIconButton
         style={style}
         name={iconName}
         size={56}
         color={disabled ? Color('#fff').alpha(0.1).string() : voted ? '#e74c3c' : 'white'}
         onPress={isDisabled ? undefined : onVote}
      />
   );
}
