import { Response } from 'express';
import Jwt from 'jsonwebtoken';
import { IUser } from '../models/user';
import { config } from 'dotenv';

config();
const secretKey = process.env.JWT_SECRET as string;
const expiresIn = 3 * 60 * 60;

interface PayloadReturn {
  id: string;
  iat: number;
  exp: number;
}
export function generateToken(user: IUser, res: Response) {
  const token = Jwt.sign({ id: user._id }, secretKey, {
    expiresIn,
  });

  // save token as a cookie
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: expiresIn * 1000, // in milliseconds
  });
  res.header('token', token);
  return token;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export function verifyToken(token: string) {
  try {
    const decoded = Jwt.verify(token, secretKey) as PayloadReturn;
    return decoded.id;
  } catch (err) {
    return null;
  }
}
