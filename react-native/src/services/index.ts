import * as auth from './api/auth';
import * as products from './api/products';
import * as userService from './api/user-service';
import * as consumption from './api/consumption';
import * as userSettings from './api/user-settings';
import * as loggedWeight from './api/logged-weight';
import * as meals from './api/meals';

export default {
    api: { auth, products, userService, consumption, userSettings, loggedWeight, meals },
};
