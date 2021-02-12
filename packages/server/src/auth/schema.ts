import Joi from 'joi';

export const credentials = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,16}$/)
    .min(6)
    .required(),
});

export const changePassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});
