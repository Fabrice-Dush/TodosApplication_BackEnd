import { Request, Response, NextFunction } from 'express';
import User, { userInterface } from './../models/user';
import jwt from 'jsonwebtoken';
import { SECRET } from './../secret';

export const authenticate = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.headers);
  const token: any = req.headers.token;
  const decoded: any = await jwt.verify(token, SECRET);
  const user = await User.findById(decoded.id);
  if (!user)
    return res.status(401).json({
      ok: false,
      message: 'fail',
      errors: { message: 'Login to access this resource' },
    });
  req.body.authenticatedUser = user;
  next();
};

export const checkUser = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  next();
};
