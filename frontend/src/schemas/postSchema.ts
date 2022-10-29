import Joi from 'joi';

export const postSchema = Joi.object({
  text: Joi.string().required(),
  privacy: Joi.string().valid('public', 'friends', 'private').required(),
});
