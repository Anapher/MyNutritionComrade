import * as auth from './api/auth';
import * as products from './api/products';
import * as userService from './api/user-service';
import * as consumption from './api/consumption';
import * as nutritionGoal from './api/nutrition-goal';

export default {
    api: { auth, products, userService, consumption, nutritionGoal },
};
