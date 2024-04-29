import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';
const joiPassword = Joi.extend(joiPasswordExtendCore);

export const passwordSchema = joiPassword
	.string()
	.noWhiteSpaces()
	.min(8)
	.max(64)
	.required();
