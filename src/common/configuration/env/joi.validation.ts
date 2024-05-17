import * as Joi from "joi"

export const JoiValidationSchema = Joi.object({
	MONGODB_HOST: Joi.string().default("localhost"),
	MONGODB_PORT: Joi.number().default(27017),
	MONGODB_DB: Joi.required(),
	MONGODB_USERNAME: Joi.required(),
	MONGODB_PASSWORD: Joi.required(),
	EMAIL_USERNAME: Joi.required(),
	EMAIL_PASSWORD: Joi.required(),
	EMAIL_PORT: Joi.required(),
	EMAIL_HOST: Joi.required(),
	EMAIL_TLS: Joi.required(),
	LOG_MAXDAYS: Joi.required(),
	JWT_SECRET: Joi.required(),
	JWT_EXPIRED: Joi.required(),
})
