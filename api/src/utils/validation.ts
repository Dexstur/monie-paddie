import Joi from 'joi';

export const signupSchema = Joi.object({
  fullName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/,
    )
    .message(
      'Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length.',
    )
    .required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .message('Invalid phone number format')
    .required(),
  bvn: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message('Invalid bvn format')
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/,
    )
    .message(
      'Password must contain at least one uppercase letter, one lowercase letter, one of these symbols (@$!%*?&#) , one digit, and be between 8 and 30 characters in length.',
    )
    .required(),
});

//airtime validation
export const airtimeValidator = Joi.object().keys({
  amount: Joi.number().required().min(0).max(20000),
  phoneNumber: Joi.string().required(),
  network: Joi.string().required(),
  transactionPin: Joi.string().required(),
});

export const validBankTransfer = Joi.object({
  amount: Joi.number().required().min(50000).max(10000000),
  pin: Joi.string().required(),
  accountName: Joi.string().required(),
  accountNumber: Joi.string().required(),
  bankName: Joi.string().required(),
  note: Joi.string().allow(''),
});

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};
