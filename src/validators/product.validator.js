import Joi from "joi";

 const createproductValidator = Joi.object({
  productName: Joi.string().trim().lowercase().required(),

  price: Joi.number()
    .positive()
    .required(),

  stock: Joi.number()
    .integer()
    .min(0)
    .default(0),

  category: Joi.string()
    .valid("Electronics", "Clothing", "Fitness", "Kitchen")
    .required()
});

const updateproductValidator = Joi.object({
  productName: Joi.string().trim().lowercase().optional(),

  price: Joi.number()
    .positive()
    .optional(),

  stock: Joi.number()
    .integer()
    .min(0)
    .optional(),

  category: Joi.string()
    .valid("Electronics", "Clothing", "Fitness", "Kitchen")
    .optional()
});



export {createproductValidator,updateproductValidator};