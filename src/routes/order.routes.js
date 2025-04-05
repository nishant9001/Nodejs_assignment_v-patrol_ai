import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import orderValidator  from "../validators/order.validator.js";
import rbac from "../middlewares/rbac.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import { placeOrder } from "../controllers/order.controller.js";

const router = Router();

router.route("/placeorder").post(
    validateRequest(orderValidator),
    verifyJWT,
    rbac("customer"),
    placeOrder
);
export default router;