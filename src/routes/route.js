import userRouter from "./user.routes.js";
import productRouter from "./product.routes.js";
import Router from "express";

const router =Router();

//routes declaration

router.use("/user", userRouter);
router.use("/product",productRouter)

export default router;