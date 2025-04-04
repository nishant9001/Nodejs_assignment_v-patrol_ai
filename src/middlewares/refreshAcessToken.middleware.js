import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import User from "../models/user.model";
import jwt from "jsonwebtoken";


// this middleware will check if accesstoken is expired so it will refresh access token 
export const refreshAccessToken = asyncHandler(async(req,res)=>
    {
        

        const token = req.cookies.acessToken;
        
        const decoded = jwt.decode(token);
        
        if (!decoded || !decoded.exp) {
          console.log("Invalid token");
        } else {
          const isExpired = decoded.exp * 1000 < Date.now();
          console.log(isExpired ? "Token expired" : "Token valid");
        }
        
      const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
       
      if(!incomingRefreshToken)
      {
        throw new ApiError(401,"Unauthorized request");
      }
    
      const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
      console.log(decodedToken);
     
      const user = await User.findById(decodedToken._id);
      if(!user)
        {
          throw new ApiError(401,"Invalid refreshToken");
        }
    
       if(user.refreshToken!=incomingRefreshToken)
       {
        throw new ApiError(401,"Expired refreshToken");
       }
    
       const options=
       {
        httpOnly:true,
        secure:true
       }
       const accessToken = await user.generateAccessToken();
       const refreshToken = await user.generateRefreshToken();
    
       user.refreshToken=refreshToken;
       user.save({validateBeforeSave: false});
      return res.status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken", refreshToken,options)
      .json(
        new ApiResponse(200,{accessToken,refreshToken},"everything is under control")
      )
    })