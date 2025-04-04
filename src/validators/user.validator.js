import Joi from "joi";

const validateRegisterUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(20).required(),
  role: Joi.string().valid("customer", "vendor", "admin").required(),
});

const validateLoginUserSchema = Joi.object({
  email:Joi.string().email().required(),
  password:Joi.string().required()
})



export {validateRegisterUserSchema,validateLoginUserSchema};
