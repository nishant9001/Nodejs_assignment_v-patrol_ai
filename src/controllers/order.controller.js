import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import {Product} from "../models/product.model.js";
import mongoose from "mongoose";


const placeOrder = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  
      const { items } = req.body; // [{productId, quantity}]
      const userId = req.user._id;
  
      const subOrdersMap = new Map();
      let totalAmount = 0;
  
      for (const item of items) {
        const product = await Product.findById(item.productId).session(session);
        if (!product || product.stock < item.quantity) {
          throw new ApiError(400, "Product not available or insufficient stock");
        }
  
        // Deduct stock
        product.stock -= item.quantity;
        await product.save({ session });
  
        totalAmount += item.quantity * product.price;
  
        // Group by vendorId
        if (!subOrdersMap.has(product.vendorId.toString())) {
          subOrdersMap.set(product.vendorId.toString(), []);
        }
  
        subOrdersMap.get(product.vendorId.toString()).push({
          productId: product._id,
          quantity: item.quantity,
          price: product.price,
        });
      }
  
      // Create sub-orders
      const subOrders = [];
      for (const [vendorId, items] of subOrdersMap) {
        const subTotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        subOrders.push({ vendorId, items, subTotal });
      }
  
      // Create master order
      const order = await Order.create(
        [
          {
            customerId: userId,
            totalAmount,
            status: "pending",
            subOrders,
          },
        ],
        { session }
      );
  
      await session.commitTransaction();
      session.endSession();
  
      return res.status(201).json(
        new ApiResponse(201,order,"Order placed successfully")
       );
    
    
  });
  

export {placeOrder};