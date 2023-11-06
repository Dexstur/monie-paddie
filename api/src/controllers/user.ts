import User from '../models/user';
import { Request, Response } from 'express';
import { generateToken } from '../utils/utils';
// import { signupSchema, loginSchema, options } from '../utils/validation'
import dev from '../utils/logs';
import Bcrypt from 'bcryptjs';

export async function login(req: Request, res: Response) {
  try {
    if (req.url.startsWith('/google/redirect?code=')) {
      // login with google

      dev.log(req.user);
      const token = generateToken(req.user, res);
      const clientUrl =
        process.env.NODE_ENV === 'development'
          ? process.env.CLIENT_URL_DEV
          : process.env.CLIENT_URL;
      return res.redirect(`${clientUrl}/sso?token=${token}`);
    }
    // manual login goes here

    // Validate user inputs
    // const validate = loginSchema.validate(req.body, options);
    // if (validate.error) {
    //   const message = validate.error.details.map((detail) => detail.message).join(',');
    //   return res.status(400).json({
    //     status: 'fail',
    //     message,
    //   });
    // }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('No user found');
    }
    if (!user.password) {
      return res.status(403).send('Invalid login route. Use SSO');
    }

    // Check if the password is correct and log in user
    const validUser = Bcrypt.compareSync(password, user.password);
    if (!validUser) {
      return res.status(404).send('invalid login details');
    }

    // Generate token and set a cookie with the token
    const token = generateToken(user, res);

    return res.status(200).json({
      message: 'User Login successful',
      data: user,
      token,
    });
  } catch (error: any) {
    return res.status(500).send('Internal server error');
  }
}

// manual signup goes here
export async function signup(req: Request, res: Response) {
  try {
    const { fullname, email, phoneNumber, bvn, password } = req.body;
    const salt = 10;

    if (!fullname || !email || !phoneNumber || !bvn || !password) {
      return res.status(400).send('All fields are required');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send('User already exists');
    }

    const hashedPassword = await Bcrypt.hash(password, salt);
    const hashedBvn = await Bcrypt.hash(bvn, salt);

    const user = await User.create({
      fullname,
      email,
      phoneNumber,
      bvn: hashedBvn,
      password: hashedPassword,
    });

    const token = generateToken(user, res);
    res.json({
      message: 'User created successfully',
      data: user,
      token,
    });
  } catch (error: any) {
    return res.status(500).send('Internal server error');
  }
}

// update user transaction pin
export async function createPin(req: Request, res: Response) {
  try {
    const { id } = req.params;
    let { transactionPin, pinConfirmation } = req.body;

    transactionPin = transactionPin.toString();
    pinConfirmation = pinConfirmation.toString();

    if (transactionPin.length !== 4 || !/^\d+$/.test(transactionPin)) {
      return res.status(400).send('Invalid transaction pin');
    }

    if (transactionPin !== pinConfirmation) {
      return res.status(400).send('Password confirmation does not match');
    }

    const salt = await Bcrypt.genSalt(10);
    const hashedPin = await Bcrypt.hash(transactionPin, salt);

    const user = await User.findByIdAndUpdate(
      id,
      { transactionPin: hashedPin, transactionPinSet: true },
      { new: true },
    );
    return res.status(200).json({
      message: 'User updated successfully',
      data: user,
    });
  } catch (error: any) {
    return res.status(500).send('Internal server error');
  }
}

export async function googleSignOn(req: Request, res: Response) {
  try {
    const { id, email, name } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        fullname: name,
        ssoId: id,
        ssoProvider: 'Google',
        verifiedEmail: true,
      });

      await user.save();
    }

    if (!user.ssoProvider) {
      user.ssoId = id;
      user.ssoProvider = 'Google';
      await user.save();
    }

    const token = generateToken(user, res);

    res.json({
      message: `Signed in as ${user.email}`,
      token,
    });
  } catch (err: any) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}
