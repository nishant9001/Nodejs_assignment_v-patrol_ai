import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Product} from "../models/product.model.js";
import {User} from "../models/user.model.js";


const addProduct = asyncHandler(async(req,res)=>
{
    const {productName,price,stock,category} = req.body;
    const user =req.user;

    if(!user)
    {
        throw new ApiError(400,"unauthorised User")
    }
    
    const productexist = await Product.findOne({vendorId:user.id,productName});
    if(productexist)
    {
        throw new ApiError(409,"product already exist");
    }
    const product = await Product.create(
        {
            vendorId:user.id,
            productName,
            price,
            stock,
            category
        }
    )

    return res.status(200).json(
        new ApiResponse(201,product,"product created successfully")
    )

})

const updateProduct = asyncHandler(async(req,res)=>
{
    
    const user =req.user;

    if(!user)
    {
        throw new ApiError(400,"unauthorised User")
    }
    
    const product = await Product.findByIdAndUpdate({_id:req.params.productId},req.body,{new:true});
    

    return res.status(200).json(
        new ApiResponse(200,product,"product updated successfully")
    )

})

const removeProduct = asyncHandler(async(req,res)=>
{
    const user =req.user;

    if(!user)
    {
        throw new ApiError(400,"unauthorised User")
    }
    
    await Product.findByIdAndDelete({_id:req.params.productId});
   

    return res.status(200).json(
        new ApiResponse(200,"product deleted successfully")
    )

})


export {addProduct,updateProduct,removeProduct};