import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';
import { RequestValidator } from '../../helper';
import { UserService } from '../../services';

const router = Router();

router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/logout', UserService.authorization, logout);

function assignTokenToCookie(res: Response, token: string) {
  return res
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .json({ message: 'Logged in successfully' });
}

function authenticateSchema(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  RequestValidator(req, next, schema);
}

function authenticate(req: Request, res: Response, next: NextFunction) {
  UserService.authenticate(req.body)
    .then((token) => assignTokenToCookie(res, token))
    .catch(next);
}

function registerSchema(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: passwordComplexity().required(),
  });
  RequestValidator(req, next, schema);
}

function register(req: Request, res: Response, next: NextFunction) {
  UserService.create(req.body)
    .then((token) => assignTokenToCookie(res, token))
    .catch(next);
}

function logout(req: Request, res: Response) {
  return res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Successfully logged out' });
}

export default router;
