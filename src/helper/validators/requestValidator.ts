import { Request, NextFunction } from 'express';
import Joi from 'joi';
import { isEmpty } from 'lodash';

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
  console.log(req.body || req.query);
  const { error, value } = schema.validate(
    !isEmpty(req.body) ? req.body : req.query,
    options
  );

  if (error) {
    next(`Error: ${error.details.map((x) => x.message).join(', ')}`);
  } else {
    req.body = value;
    next();
  }
}

export default validateRequest;
