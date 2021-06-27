import Joi from 'joi';
import { errorMsg } from '../utils/response';

// eslint-disable-next-line consistent-return
const validateBody = (schema) => (req, res, next) => {
  const result = schema.validate(req.body);

  if (result.error) {
    const error = result.error.details[0].message;
    return errorMsg(res, 400, error);
  }

  if (!req.value) { req.value = {}; }
  req.value.body = result.value;
  next();
};

const schema = {
  signup: Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .min(5)
      .max(100)
      .required()
      .messages({
        'string.empty': 'email cannot be an empty field',
        'string.email': 'please enter a valid email',
        'any.required': 'email is required',
      }),
    password: Joi.string()
      .min(5)
      .max(20)
      .required()
      .messages({
        'any.required': 'password is required',
        'string.empty': 'password cannot be an empty field',
        'string.min': 'password should have a minimum length of 5',
      }),
    firstName: Joi.string()
      .min(3)
      .required()
      .messages({
        'string.empty': 'first name cannot be an empty field',
        'string.min': 'first name should have a min length of 3',
        'any.required': 'first name is required',
      }),
    lastName: Joi.string()
      .min(3)
      .required()
      .messages({
        'string.empty': 'last  name cannot be an empty field',
        'string.min': 'last  name should have a min length of 3',
        'any.required': 'last  is required',
      }),
    phone: Joi.string()
      .required()
      .messages({
        'string.empty': 'phone cannot be an empty field',
        'any.required': 'phone is required',
      }),
  }),

  login: Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .min(5)
      .max(100)
      .required()
      .messages({
        'string.empty': 'email cannot be an empty field',
        'string.email': 'please enter a valid email',
        'any.required': 'email is required',
      }),
    password: Joi.string()
      .min(5)
      .max(20)
      .required()
      .messages({
        'any.required': 'password is required',
        'string.empty': 'password cannot be an empty field',
        'string.min': 'password should have a minimum length of 5',
      }),
  }),

  verifyUser: Joi.object().keys({
    confirmToken: Joi.string()
      .min(6)
      .required()
      .messages({
        'any.required': 'confirmation token is required',
        'string.empty': 'confirmation token cannot be an empty field',
        'string.min': 'confirmation token should have a minimum length of 6',
      }),
  }),
};

export { validateBody, schema };
