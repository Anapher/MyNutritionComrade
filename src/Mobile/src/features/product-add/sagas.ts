import { put, select, takeEvery } from 'redux-saga/effects';
import { productRepositoryUpdated } from '../repo-manager/reducer';
import { selectProduct } from '../repo-manager/selectors';
import { initialize } from './reducer';
import { selectSlider } from './selectors';

function* onProductRepositoryUpdated() {
   const slider: ReturnType<typeof selectSlider> = yield select(selectSlider);
   if (!slider) return;

   const productFromCurrentIndex: ReturnType<typeof selectProduct> = yield select(selectProduct, slider.product.id);
   if (!productFromCurrentIndex) return;

   if (productFromCurrentIndex.modifiedOn !== slider.product.modifiedOn) {
      yield put(
         initialize({ product: productFromCurrentIndex, amount: slider.amount, servingType: slider.servingType }),
      );
   }
}

function* productSearchSaga() {
   yield takeEvery(productRepositoryUpdated, onProductRepositoryUpdated);
}

export default productSearchSaga;
