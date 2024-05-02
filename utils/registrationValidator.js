const Joi = require("joi");

const registerValidatorSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required().trim().messages({
    "string.base": "Name must be of type text.",
    "string.min": "Name must be of at lease two characters.",
    "string.max": "Name cannot be more than 100 characters.",
    "any.required": "Name is required",
  }),

  lastName: Joi.string().min(2).max(100).required().trim().messages({
    "string.base": "Name must be of type text.",
    "string.min": "Name must be of at lease two characters.",
    "string.max": "Name cannot be more than 100 characters.",
    "any.required": "Name is required",
  }),

  username: Joi.string().alphanum().min(3).max(16).required().trim().messages({
    "string.base": "Username must contain only alphanumeric characters",
    "string.min": "Username must be of at least 3 characters.",
    "string.max": "Username can't be more than 16 characters.",
    "any.required": "Username is required.",
  }),

  phone: Joi.number().required().messages({
    "string.base": "Phone number must be valid.",
    "any.required": "Phone number is required.",
  }),

  email: Joi.string().email().required().trim().messages({
    "string.base": "Email must be a valid email address.",
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
  }),

  dob: Joi.date(),

  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required().messages({
    "string.base": "Please enter a valid gender.",
    "string.valid": "Please enter a valid gender.",
    "any.required": "Gender is required.",
  }),

  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .min(8)
    .max(255)
    .required()
    .messages({
      "string.base": "Password is not valid",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character ",
      "string.min": "Password must be of at least 8 characters.",
      "string.max": "Password can't be more than 255 characters.",
      "any.required": "Password is required.",
    }),

  password2: Joi.ref("password"),
});

module.exports = registerValidatorSchema;
