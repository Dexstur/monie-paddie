import Joi from "joi";

//airtime validation
export const airtimeValidator = Joi.object().keys({
  amount: Joi.number().required().min(1),
  phoneNumber: Joi.string().required(),
  network: Joi.string().required(),
  transactionPin: Joi.string().required()
})

/**validation options*/
export const validationOptions = {
  abortEarly: false,
  errors: { wrap: { label: "" } },
};