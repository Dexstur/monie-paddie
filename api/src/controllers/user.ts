import User from '../models/user';
import { Request, Response } from 'express';
import { generateToken } from "../utils/utils";
import dev from '../utils/logs';



export async function login(req: Request, res: Response) {
  try {
    if (req.url.startsWith("/google/redirect?code=")) {
      // res.send('you reached the callback URI'); return;
      // login with google
      dev.log(req.user)
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