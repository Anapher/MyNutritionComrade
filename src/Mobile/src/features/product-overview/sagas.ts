import api from 'src/services/api';
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { productRepositoryUpdated } from '../repo-manager/reducer';
import { selectProduct } from '../repo-manager/selectors';
import {
   beginLoadingContributionStatus,
   contributionStatusLoaded,
   initialize,
   InitializeProductOverviewPayload,
} from './reducer';
import { selectCurrentProduct } from './selectors';
import { ProductContributionStatusDto } from 'src/types';

function* onProductRepositoryUpdated() {
   const product: ReturnType<typeof selectCurrentProduct> = yield select(selectCurrentProduct);
   if (!product) return;

   const productFromCurrentIndex: ReturnType<typeof selectProduct> = yield select(selectProduct, product.id);
   if (!productFromCurrentIndex) return;

   if (productFromCurrentIndex.modifiedOn !== product.modifiedOn) {
      yield put(initialize({ product: productFromCurrentIndex }));
   }
}

function* onInitializeProduct({
   payload: { product, contributionStatus },
}: PayloadAction<InitializeProductOverviewPayload>) {
   if (!contributionStatus) {
      yield put(beginLoadingContributionStatus());

      const dto: ProductContributionStatusDto = yield call(api.product.getContributionStatus, product.id);

      yield put(contributionStatusLoaded({ productId: product.id, dto }));
   }
}

function* productSearchSaga() {
   yield takeEvery(productRepositoryUpdated, onProductRepositoryUpdated);
   yield takeEvery(initialize, onInitializeProduct);
}

export default productSearchSaga;
