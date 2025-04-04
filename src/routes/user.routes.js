import {Router} from "express"
import 
{
    registerUser,
    loginUser,
    logoutUser,
    // refreshAccessToken,
    // changeCurrentPassword,
    // getCurrentUser,
    // updateUserDetails,
    // getOrderHistory
} from "../controllers/user.controller.js";
import {validateRegisterUserSchema,validateLoginUserSchema} from "../validators/user.validator.js"
import {validateRequest} from "../middlewares/validateRequest.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"


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
router.route("/logout").post(
    verifyJWT,
    logoutUser
)

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