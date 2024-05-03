import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import User, { login } from './../models/user';
import { SECRET } from './../secret';

const maxAge = 3 * 24 * 60 * 60;
const generateToken = function (id: Number): String {
  const token = jwt.sign({ id }, SECRET, {
    expiresIn: maxAge,
  });

  return token;
};

export const loginGET = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res
      .status(200)
      .json({ ok: true, message: 'success', data: 'Display login form' });
  } catch (err) {
    next(err);
  }
};

export const loginPOST = async function (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    if (!user) throw new Error('Wrong email or password');
    const token = generateToken(user.id);
    res.status(200).json({
      ok: true,
      message: 'success',
      token,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const signupGET = async function (req: Request, res: Response) {
  try {
    res
      .status(200)
      .json({ ok: true, message: 'success', data: 'Display signup form' });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'fail',
      errors: err,
    });
  }
};

export const signupPOST = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = new User(req.body);
    await user.save();
    const token = generateToken(user.id);

    res.status(201).json({ ok: true, message: 'success', token, data: user });
  } catch (err) {
    next(err);
  }
};

export const logout = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log('Logged you out bruh');
    res.status(200).json({ ok: true, message: 'success' });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'fail' });
  }
};

export const settings = async function (req: Request, res: Response) {
  try {
    res.render('users/settings');
  } catch (err) {}
};

export const deleteAccount = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.body.authenticatedUser;
    const msg = await User.findByIdAndDelete(user.id);
    res.redirect('/todos');
  } catch (err) {
    next(err);
  }
};
