import Joi from 'joi';

export const todoID = Joi.number().integer().positive();

export const newTodo = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

export const updateTodo = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  done: Joi.boolean().required(),
});
