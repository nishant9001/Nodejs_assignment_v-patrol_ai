import {asyncHandler} from ".././utils/asyncHandler.js";
import {ApiResponse} from ".././utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";
import fs, { writeFileSync } from "fs";


const registerUser = asyncHandler(async(req,res)=>
{
  
  const {email,name,password,role} = req.body;
   console.log(req.body);
  const existUser = await User.findOne(
    {
      email
    }
  )
  if(existUser)
  {
    throw new ApiError(409,"User with email already exists");
  }

  // create user object - create entry in db
  const user =await User.create(
    {
      name,
      email,
      password,
      role
    }
  )
  
 
  // remove password and refresh token field from response
  const createdUser= await User.findById(user._id).select("-password -refreshToken");


   // check for user creation
  if(!createdUser)
  {
    throw new ApiError(500,"Something went wrong while registering the user");
  }
 
  // return res
  return res.status(201).json
    (
      new ApiResponse(200,createdUser,"User registered successfully")
    )
  
  }
)

const loginUser =asyncHandler(async(req,res)=>
{
  console.log(req.body)
  const {email,password} = req.body;
  if(!email)
    {
      throw new ApiError(400,"email is required");
    }

  //* username or email is exist in db or not 
  const user = await User.findOne({email});
  if(!user)
  {
    throw new ApiError(400,"User Not found");
  }

  //* check password 
  const ispasswordValid = await user.isPasswordCorrect(password);
  if(!ispasswordValid)
    {
      throw new ApiError(401,"Invalid user credentials");
    }

  // access and refresh token 

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  
  user.refreshToken=refreshToken;
  await user.save({validateBeforeSave: false}); 
  
  const options =
  {  
  httpOnly:true,
  secure:true
  }

   // return res 
  return res.status(200)
  .cookie("accessToken",accessToken, options)
  .cookie("refreshToken",refreshToken, options)
  .json(
    new ApiResponse(200,{user:user},"User logged In Successfully")
  )

 
})

const logoutUser = asyncHandler(async(req,res)=>
{
  const user = req.user;
  console.log(user);
  await User.findByIdAndUpdate(
    user._id,
    {
      $unset:
      {refreshToken:""}
    },
    {new:true})

    const options = {
      httpOnly:true,
      secure:true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken", options)
    .json(
       new ApiResponse(200,{},"User logged out ")
    )
  
})


// const changeCurrentPassword = asyncHandler(async(req,res)=>
// {
//   console.log(req.user);
//   const {currentPassword,newPassword} = req.body;
//   console.log(req.body);
//   const user=await User.findById(req.user._id);
//   console.log(user);

//   const ans=await user.isPasswordCorrect(currentPassword);
//   if(!ans)
//   {
//     throw new ApiError(401,"currentPassword is Incorrect");
//   }

//   user.password = newPassword;
//   await user.save({validateBeforeSave: false});

//   const accessToken=await user.generateAccessToken();
//   const refreshToken=await user.generateRefreshToken();

//   const options={
//     httpsOnly:true,
//     secure:true
//   }
//   return res.status(200)
//   .cookie("accessToken",accessToken,options)
//   .cookie("refreshToken",refreshToken,options)
//   .json(
//     new ApiResponse(200,"Password changed successfully")
//   )


// })

// const getCurrentUser= asyncHandler(async(req,res)=>
// {
//   return res.status(200)
//   .json(
//     new ApiResponse(200,req.user,"current user fetched succesfully")
//   )
// })

// const updateUserDetails = asyncHandler(async(req,res)=>
// {
//  console.log(req.user);
//  const {fullName,email} = req.body;

//  let arr={};
//  if(fullName)
//  {
//   arr.fullName=fullName
//  }
//  if(email)
//  {
//   arr.email=email;
//  }
//  const user=await User.findByIdAndUpdate(req.user._id,
//   {
//     $set:arr
//   },
//   {
//     new:true
//   }
//  ).select("-password")

//  return res.status(200)
//  .json( new ApiResponse(200,user,"updated successfully"))

// })

// const updateUserAvatar = asyncHandler(async(req,res)=>
// {
//   //console.log(req.file);
//   const avatarLocalPath = req.file?.path;
//   if(!avatarLocalPath)
//   {
//     throw new ApiError(401,"avatarfilepath not available")
//   }
//   const responseAvatar = await uploadOnCloudinary(avatarLocalPath);
//   const Id=responseAvatar.public_id;
//   deleteOnCloudinary(Id);
  
//   if(!responseAvatar.url)
//   {
//     throw new ApiError(401,"error while uploading the file on cloudinary")
//   }
//   const user=await User.findByIdAndUpdate(req.user._id,
//     {$set:
//       {
//         avatar:responseAvatar.url
//       }
//     },
//     {new:true}
//   ).select("-password")

  
//   return res.status(200)
//   .json(
//     new ApiResponse(200,user,"avatar updated successfully")
//   )
// })

// const updateUserCoverImage = asyncHandler(async(req,res)=>
//   {
//     const CoverImageLocalPath = req.file?.path;
  
//     if(!CoverImageLocalPath)
//     {
//       throw new ApiError(401,"CoverImagefilepath not available")
//     }
//     const responseCoverImage = await uploadOnCloudinary(CoverImageLocalPath);
//     const Id=responseCoverImage.public_id;
//     if(!responseCoverImage.url)
//     {
//       throw new ApiError(401,"error while uploading the file on cloudinary")
//     }
//     const user=await User.findByIdAndUpdate(req.user._id,
//       {$set:
//         {
//           avatar:responseCoverImage.url
//         }
//       },
//       {new:true}
//     ).select("-password")
   
//     deleteOnCloudinary(Id);
//     return res.status(200)
//     .json(
//       new ApiResponse(200,user,"CoverImage updated successfully")
//     )
//   })

// const getUserChannelProfile = asyncHandler(async(req,res)=>
// {

//   const {username}=req.params;
//   if(!username?.trim())
//   {
//     throw new ApiError(400,"username is missing");
//   }
//   const channel = await User.aggregate(
//     [
//       {
//         $match:
//         {
//           username:username
//         }
//       },
//       {
//         $lookup:
//         {
//           from:"subscriptions",
//           localField:"_id",
//           foreignField:"channel",
//           as:"subscribers"
//         }
//       },
//       {
//         $lookup:
//         {
//           from:"subscriptions",
//           localField:"_id",
//           foreignField:"subscriber",
//           as:"subscribedTo"
//         }
//       },
//       {
//         $addFields:
//         {
//           subscribersCount:
//           {
//             $size:"$subscribers"
//           },
//           channelsSubscribedToCount:
//           {
//             $size:"$subscribedTo"
//           },
//           isSubscribed:
//           {
//             $cond:{
//               if:{$in: [req.user?._id,"$subscribers.subscriber"]},   //$sign shows its a field
//               then:true,
//               else:false
//             }
//           }
//         }
//       },
//       {
//         $project:
//         {
//           fullName:1,
//           username:1,
//           subscribers:1,
//           subscribedTo:1,
//           subscribersCount:1,
//           isSubscribed:1,
//           channelsSubscribedToCount:1,
//           avatar:1,
//           coverImage:1,
//           email:1
//         }
//       }
//     ]
//   )
   
//   if(!channel?.length)
//   {
//     throw new ApiError(404,"channel does not exists");
//   }

//   return res.status(200)
//   .json(
//     new ApiResponse(200,channel[0],"data fetched successfully")
//   )
// })

// const getWatchHistory = asyncHandler(async(req,res)=>
// {
//   //const user =req.user;

//   const user= await User.aggregate(
//     [
//       {
//         // whenever we are using find or findbyid we pass the string directly as a mongodb id 
//         // because mongoose did that conversion for us (ObjectId('_id')) but in aggregation it will 
//         // pass as like as we written so keep it in my mind. here we have to do it on our own
//         $match:
//         {
//           _id:new mongoose.Types.ObjectId(req.user._id)       
//         }
//       },
//       {
//         $lookup:
//         {
//           from:"videos",
//           localField:"watchHistory",
//           foreignField:"_id",
//           as:"watchHistory",
//           pipeline:[
//             {
//               $lookup:
//               {
//                 from:"users",
//                 localField:"owner",
//                 foreignField:"_id",
//                 as:"owner",
//                 pipeline:[
//                   {
//                     $project:
//                     {
//                       fullName:1,
//                       username:1,
//                       avatar:1
//                     }
//                   }
//                 ]
//               }
//             },
//             {
//               $addFields:
//               {
//                 owner:
//                 {
//                   $first:"$owner"   // because now data of owner will be a object not the (user data object in array)
//                 }
//               }
//             }
//           ]
//         }
//       }
//     ]
//   )

//   return res.status(200)
//   .json(
//     new ApiResponse(
//       200,
//       user[0].watchHistory,
//       "watch history fetched successfully")
//   )
// })

export {
  registerUser,
  loginUser,
  logoutUser,
  // refreshAccessToken,
  // changeCurrentPassword,
  // getCurrentUser,
  // updateUserDetails,
  // updateUserAvatar,
  // updateUserCoverImage,
  // getUserChannelProfile,
  // getWatchHistory
}