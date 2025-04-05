import userRouter from "./user.routes.js";
import productRouter from "./product.routes.js";
import orderRouter from "./order.routes.js";
import Router from "express";

const router =Router();

//routes declaration

router.use("/user", userRouter);
router.use("/product",productRouter);
router.use("/order",orderRouter);

export default router;