import {Router} from "express";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {createproductValidator,updateproductValidator} from "../validators/product.validator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import rbac from "../middlewares/rbac.middleware.js";
import {addProduct,updateProduct,removeProduct} from "../controllers/product.controller.js";
const router = Router();

router.route("/addProduct").post(
    validateRequest(createproductValidator),
    verifyJWT,
    rbac("vendor"),
    addProduct
)

router.route("/updateProduct/c/:productId").patch(
    validateRequest(updateproductValidator),
    verifyJWT,
    rbac("vendor"),
    updateProduct
)

router.route("/removeProduct/c/:productId").delete(
    verifyJWT,
    rbac("vendor"),
    removeProduct
)

export default router;