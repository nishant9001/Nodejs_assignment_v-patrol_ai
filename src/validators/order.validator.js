import Joi from "joi";

// ObjectId validation using regex (24-char hex string)
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("Invalid ObjectId");

// Suborder validator
const itemSchema= Joi.object({
  productId: objectId.required(),
  quantity: Joi.number().integer().min(1).required()
});

// Order validator
 const orderValidator = Joi.object({
  items: Joi.array().items(itemSchema).min(1).required()
});

export default orderValidator;