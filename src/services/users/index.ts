import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { IUserObject } from '../../interfaces';
import { MySqlDB as db } from '../../db';

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response<any, Record<string, any>> => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.clearCookie('access_token').sendStatus(403);
  }
};

function generateToken(id: number, username: string): string {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

export async function authenticate({
  username,
  password,
}: IUserObject): Promise<any> {
  const user = await db.User.scope('withHash').findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.hash)))
    throw 'Username or password is incorrect';

  // authentication successful
  return generateToken(user.id, user.username);
}

export async function create(params: IUserObject): Promise<any> {
  // validate
  if (await db.User.findOne({ where: { username: params.username } })) {
    throw 'Username "' + params.username + '" is already taken';
  }

  // hash password
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // save user
  const user = await db.User.create(params);
  return generateToken(user.id, user.username);
}
