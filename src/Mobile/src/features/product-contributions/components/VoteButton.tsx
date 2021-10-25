import Color from 'color';
import React from 'react';
import AnimatedIconButton from 'src/components/AnimatedIconButton';

type Props = {
   isUpvote?: boolean;
   existingVote?: boolean;
   pendingVote?: boolean;
   onVote: () => void;
   disabled?: boolean;
};

export default function VoteButton({ isUpvote = false, existingVote, pendingVote, onVote, disabled }: Props) {
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
