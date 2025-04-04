import Joi from "joi";

// ObjectId validation using regex (24-char hex string)
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("Invalid ObjectId");

// Suborder item validator
const itemSchema = Joi.object({
  productId: objectId.required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().positive().required()
});

// Suborder validator
const subOrderSchema = Joi.object({
  vendorId: objectId.required(),
  items: Joi.array().items(itemSchema).min(1).required(),
  subTotal: Joi.number().positive().required()
});

// Order validator
export const orderValidator = Joi.object({
  totalAmount: Joi.number().positive().required(),

  status: Joi.string()
    .valid("pending", "completed", "cancelled")
    .required(),

  subOrders: Joi.array().items(subOrderSchema).min(1).required()
});
