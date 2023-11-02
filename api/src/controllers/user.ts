import User from '../models/user';
import { Request, Response } from 'express';
import { generateToken } from "../utils/utils";



export async function login(req: Request, res: Response) {
  try {
    if (req.url.startsWith("/google/redirect?code=")) {
      // login with google
      const token = generateToken(req.user, res);
      const clientUrl = process.env.NODE_ENV === "development"? process.env.CLIENT_URL_DEV : process.env.CLIENT_URL;
      return res.redirect(`${clientUrl}/sso?token=${token}`);
    }
    // manual login goes here

  } catch (error: any) {
    return res.status(500).send("Internal server error");
  }
}

// manual signup goes here