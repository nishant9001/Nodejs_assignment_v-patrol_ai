import {Router} from "express"
import 
{
    registerUser,
    loginUser,
    logoutUser,
    // getDailySales,
    // getLowStockItems, 
    // getRevenuePerVendor,
    // getTopProducts,
    // getAverageOrderValue
    // refreshAccessToken,
    // changeCurrentPassword,
    // getCurrentUser,
    // updateUserDetails,
    // getOrderHistory
} from "../controllers/user.controller.js";
import {validateRegisterUserSchema,validateLoginUserSchema} from "../validators/user.validator.js";
import {validateRequest} from "../middlewares/validateRequest.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import rbac from "../middlewares/rbac.middleware.js";


const router = Router();

router.route("/register").post(
    validateRequest(validateRegisterUserSchema),
    registerUser
);


router.route("/login").post(
    validateRequest(validateLoginUserSchema),
    loginUser
)

//secured routes
router.use( verifyJWT);

router.route("/logout").post(
    logoutUser
)


// vendor api 

// router.route("/dailysales").get(
//     rbac("vendor"),
//     getDailySales
//     // get daily sales (7 days)
// )

// router.route("/lowStockItems").get(
//     rbac("vendor"),
//     getLowStockItems
//     // get low stock items (below 10)
// )


// Admin Api

// router.route("/revenue/c/:VendorId").get(
//     rbac("admin"),
//     getRevenuePerVendor
// )

// router.route("/topproducts").get(
//     rbac("admin"),
//     getTopProducts
//     // top five products
// )

// router.route("/averageordervalue").get(
//     rbac("admin"),
//     getAverageOrderValue
    
// )


// router.route("/refresh").post(refreshAccessToken);  // put this in middleware for efficiency

// router.route("/changepassword").patch
// (
//     verifyJWT,
//     changeCurrentPassword
// );

// router.route("/getUser").get(
//     verifyJWT,
//     getCurrentUser
// )

// router.route("/updateUser").patch(
//     verifyJWT,
//     updateUserDetails
// )

// router.route("/getUserProfile/c/:email").get
// (
//     verifyJWT,
//     getUserProfile
// ) 


export default router;