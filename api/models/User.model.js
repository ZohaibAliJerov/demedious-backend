import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    max: 30,
    min: 3,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    max: 30,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    max: 16,
    min: 8,
  },
});

export default mongoose.model("User", userSchema);

export const validate = (user) => {
  const schema = Joi.object({
    username: Joi.string().required().min(3).max(30).trim(),
    email: Joi.string().email().required().max(30).unique(true),
    password: Joi.string().required().trim().max(16).min(8),
  });
  return schema.validate(user);
};
