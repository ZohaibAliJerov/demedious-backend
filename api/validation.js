import Joi from "joi";

export let registerValidation = (data) => {
  let schema = Joi.object({
    username: Joi.string().required().min(3).max(30).trim(),
    email: Joi.string().email().required().max(30).unique(true),
    password: Joi.string().required().trim().max(16).min(8),
  });
  return schema.validate(data);
};

export let loginValidation = (data) => {
  let schema = Joi.object({
    email: Joi.string().email().required().max(30).unique(true),
    password: Joi.string().required().trim().max(16).min(8),
  });
  return schema.validate(data);
};
