/**
 * Created by AyushK on 18/09/20.
 */

import {stringConstants} from "../app/common/constants";
import blManager from "../app/modules/operations/blManager";
import authenticateToken from "../middleware/authenticateToken";

module.exports = (app) => {
    app.get('/', (req, res) => res.send(stringConstants.SERVICE_STATUS_HTML));

    /**
     * route definition
     */
    //app.get("/test-route", ValidationManger.validateUserLogin, new TestModule());
    app.post('/create-table', new blManager().createTable);
    app.post("/register",new blManager().register);
    app.post("/login",new blManager().login);
    app.get("/getUsers",authenticateToken, new blManager().getUsers);
};
