import Joi from 'joi';

export const userID = Joi.number().integer().positive();
