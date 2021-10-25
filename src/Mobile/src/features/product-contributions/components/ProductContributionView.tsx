import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import getPatchView from 'src/components-domain/ProductPatchGroup';
import ProductPatchStatusChip from 'src/components-domain/ProductPatchStatusChip';
import useSafeRequest from 'src/hooks/useSafeRequest';
import api from 'src/services/api';
import { Product, ProductContributionDto } from 'src/types';
import { showErrorAlert } from 'src/utils/error-alert';
import { formatNumber } from 'src/utils/string-utils';
import VoteButton from './VoteButton';

type Props = {
   data: ProductContributionDto;
   product: Product;
};

export default function ProductContributionView(props: Props) {
   return (
      <View>
         <View style={{ display: 'flex', flexDirection: 'row' }}>
            <ProductContributionContent {...props} />
            <VoteControls {...props} />
         </View>
         <View style={{ marginTop: 16 }}>
            <ProductContributionFooter {...props} />
         </View>
      </View>
   );
}

function VoteControls({ data }: Props) {
   const { t } = useTranslation();
   const { makeSafeRequest } = useSafeRequest();

   const [pendingVote, setPendingVote] = useState<boolean | undefined>(undefined);
   const handleVote = async (vote: boolean) => {
      setPendingVote(vote);
      try {
         await makeSafeRequest(() => api.product.voteContribution(data.productId, data.id, vote), true);
      } catch (error) {
         showErrorAlert(error);
      }
   };

   if (data.status !== 'pending') return null;

   return (
      <View style={{ alignItems: 'center' }}>
         <View style={{ marginVertical: -16 }}>
            <VoteButton
               disabled={data.createdByYou}
               isUpvote
               existingVote={data.yourVote?.approve}
               pendingVote={pendingVote}
               onVote={() => handleVote(true)}
            />
         </View>
         <Text style={styles.voteText}>{data.statistics.totalVotes}</Text>
         <View style={{ marginVertical: -16 }}>
            <VoteButton
               disabled={data.createdByYou}
               existingVote={data.yourVote?.approve}
               pendingVote={pendingVote}
               onVote={() => handleVote(false)}
            />
         </View>
         {data.statistics.totalVotes > 0 && (
            <View style={{ alignItems: 'center' }}>
               <Text style={styles.voteProportionText}>
                  {t('product_contributions.approve_percentage', {
                     value: formatNumber((data.statistics.approveVotes / data.statistics.totalVotes) * 100),
                  })}
               </Text>
            </View>
         )}
      </View>
   );
}

function ProductContributionFooter({ data }: Props) {
   const { t } = useTranslation();

   if (data.status === 'applied') {
      return <Text style={[styles.statusText, styles.appliedText]}>{t('product_contributions.applied')}</Text>;
   }

   if (data.status === 'rejected') {
      return <Text style={[styles.statusText, styles.rejectedText]}>{t('product_contributions.rejected')}</Text>;
   }

   return null;
}

function ProductContributionContent({ data, product }: Props) {
   const { t } = useTranslation();

   if (data.operations.length > 0) {
      const info = getPatchView(data.operations, product, t);

      return (
         <View>
            <View style={styles.row}>
               <ProductPatchStatusChip status={info.type} />
               <Text style={styles.titleText}>{info.title}</Text>
            </View>
            <View style={{ marginTop: 16 }}>{info.view}</View>
            {data.createdByYou && (
               <Text style={styles.contributionFromUserText}>{t('product_contributions.contribution_from_you')}</Text>
            )}
         </View>
      );
   }

   return <Text>{t('product_contributions.initialize_product')}</Text>;
}

const styles = StyleSheet.create({
   titleText: {
      marginLeft: 8,
   },
   row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
   },
   contributionFromUserText: {
      fontSize: 12,
      marginTop: 16,
      color: '#7f8c8d',
   },
   statusText: {
      textTransform: 'uppercase',
      fontSize: 18,
      letterSpacing: 1,
      fontWeight: '700',
   },
   appliedText: {
      color: '#27ae60',
   },
   rejectedText: {
      color: '#e74c3c',
   },
   voteText: {
      fontSize: 16,
      fontWeight: '700',
   },
   voteProportionText: {
      fontSize: 9,
   },
});
