import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Color from 'color';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import FlatButton from 'src/components/FlatButton';
import useRequestData from 'src/hooks/useRequestData';
import { RootNavigatorParamList } from 'src/RootNavigator';
import api from 'src/services/api';
import { Product } from 'src/types';

type Props = {
   product: Product;
};

export default function AddProductFooter({ product }: Props) {
   const { t } = useTranslation();
   const navigation = useNavigation<NativeStackNavigationProp<RootNavigatorParamList>>();

   const [data] = useRequestData(() => api.product.getContributionStatus(product.id));
   const hasPendingContributions = data && data.openContributions > 0;

   const handleOpenProductOverview = () => {
      navigation.push('ProductOverview', { product, contributionStatus: data });
   };

   const handleOpenProductContributions = () => {
      navigation.push('ProductContributions', { product });
   };

   return (
      <View style={styles.bottomButtonContainer}>
         <FlatButton
            style={styles.bottomButton}
            text={t('add_product.show_product')}
            icon="database"
            center
            onPress={handleOpenProductOverview}
         />
         <FlatButton
            style={[
               styles.bottomButton,
               hasPendingContributions && { backgroundColor: Color('#e67e22').alpha(0.3).string() },
            ]}
            text={
               hasPendingContributions
                  ? t('add_product.contributions_pending', { count: data.openContributions })
                  : t('add_product.show_history')
            }
            icon="poll-box"
            center
            onPress={handleOpenProductContributions}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   bottomButtonContainer: {
      display: 'flex',
      flexDirection: 'row',
   },
   bottomButton: {
      flex: 1,
   },
});
