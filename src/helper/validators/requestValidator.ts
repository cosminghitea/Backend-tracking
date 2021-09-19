import { Request, NextFunction } from 'express';
import Joi from 'joi';

import { requestValidatorSchemaInterface } from './requestValidatorSchemaInterface';

function validateRequest(
  req: Request,
  next: NextFunction,
  schema: Joi.ObjectSchema<requestValidatorSchemaInterface>
): void {
  const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };
  const { error, value } = schema.validate(req.body, options);

  if (error) {
    next(`Error: ${error.details.map((x) => x.message).join(', ')}`);
  } else {
    req.body = value;
    next();
  }
}

export default validateRequest;
