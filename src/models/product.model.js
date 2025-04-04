import {mongoose,Schema} from "mongoose";

const productSchema = new Schema(
  {
   productName:
   {
    type:String,
    required:true,
    lowercase:true,
    trim:true,
   },
   price:
   {
    type:Number,
    required:true
   },
   stock:
   {
    type:Number,
    default:0
   },
   vendorId:
   {
    type:Schema.Types.ObjectId,
    ref:"User",
   },
   category:{
    type:String,
    enum:["Electronics","Clothing","Fitness","Kitchen"],
    default:"Kitchen",
    required:true
   }
  },
  {
    timestamps:true
  }
)


export const Product = mongoose.model("Product",productSchema);

