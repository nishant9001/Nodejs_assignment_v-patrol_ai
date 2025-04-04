import mongoose,{Schema} from "mongoose";


const subOrderSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId:
      { type: Schema.Types.ObjectId, 
        ref: "Product", 
        required: true
      },
      quantity: 
      { type: Number, 
        required: true 
      },
      price: 
      { type: Number, 
        required: true 
      }
    }
  ],
  subTotal: {
    type: Number,
    required: true
  }
},{ _id: false });



const orderSchema = new Schema(
  {
    customerId:
    {
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    totalAmount:
    {
      type:Number,
      required:true
    },
    status:
    {
      type:String,
      enum:["pending","completed","cancelled"],
      required:true
    },
    subOrders:
    [
      subOrderSchema
    ]
  },
  {
    timestamps:true
  }
)


export const Order = mongoose.model("Order",orderSchema);
