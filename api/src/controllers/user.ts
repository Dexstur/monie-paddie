import User from '../models/user';
import { Request, Response } from 'express';
import { generateToken } from '../utils/utils';
// import { signupSchema, loginSchema, options } from '../utils/validation'
import dev from '../utils/logs';
import Bcrypt from 'bcryptjs';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Please enter credentials',
        error: 'Invalid credentials',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'Sing up instead?',
        error: 'User not found',
      });
    }
    if (!user.password) {
      return res.status(403).json({
        message: 'External Oauth user',
        error: 'Invalid credentials',
      });
    }

    // Check if the password is correct and log in user
    const validUser = Bcrypt.compareSync(password, user.password);
    if (!validUser) {
      return res.status(401).json({
        message: 'Invalid credentials',
        error: 'Invalid credentials',
      });
    }

    // Generate token and set a cookie with the token
    const token = generateToken(user, res);

    return res.status(200).json({
      message: 'User Login successful',
      data: user,
      setPin: user.transactionPinSet,
      token,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
}

// manual signup goes here
export async function signup(req: Request, res: Response) {
  try {
    const { fullname, email, phoneNumber, bvn, password } = req.body;
    const salt = 10;

    if (!fullname || !email || !phoneNumber || !bvn || !password) {
      return res.status(400).json({
        message: 'Signup failed',
        error: 'All fields are required',
      });
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
      completeRegistration: true,
    });

    const token = generateToken(user, res);
    res.json({
      message: 'User created successfully',
      data: user,
      setPin: user.transactionPinSet,
      token,
    });
  } catch (error: any) {
    return res.status(500).send('Internal server error');
  }
}

// update user transaction pin
export async function createPin(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: 'No token provided',
      });
    }
    const id = req.user;
    let { transactionPin, pinConfirmation } = req.body;

    transactionPin = transactionPin.toString();
    pinConfirmation = pinConfirmation.toString();

    if (transactionPin.length !== 4 || !/^\d+$/.test(transactionPin)) {
      return res.status(400).json({
        message: 'Please use only digits (must be 4 digits long)',
        error: 'Invalid transaction pin',
      });
    }

    if (transactionPin !== pinConfirmation) {
      return res.status(409).json({
        message: 'Confirmation pin must be the same as transaction pin',
        error: 'Pin mismatch',
      });
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
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
      error,
    });
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
      registered: user.completeRegistration,
      token,
    });
  } catch (err: any) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

export async function completeRegistration(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: 'No token provided',
      });
    }
    const { bvn, phoneNumber } = req.body;
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'User not found',
      });
    }
    if (user.completeRegistration) {
      return res.status(409).json({
        message: 'User already completed registration',
        error: 'User already completed registration',
      });
    }

    if (!bvn || !phoneNumber) {
      return res.status(400).json({
        message: 'Please enter BVN and Phone Number',
        error: 'Invalid credentials',
      });
    }

    const salt = await Bcrypt.genSalt(10);
    const hashedBvn = await Bcrypt.hash(bvn, salt);
    user.bvn = hashedBvn;
    user.phoneNumber = phoneNumber;
    user.completeRegistration = true;
    await user.save();

    return res.json({
      message: 'Registration complete',
      data: user,
    });
  } catch (err: any) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

export async function dashboard(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: 'No token provided',
      });
    }
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'User not found',
      });
    }
    return res.json({
      message: 'User dashboard',
      data: user,
      setPin: user.transactionPinSet,
    });
  } catch (err: any) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: 'No token provided',
      });
    }
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'User not found',
      });
    }

    const { picture } = req.body;
    if (!picture) {
      return res.status(400).json({
        message: 'Please upload a picture',
        error: 'Bad request',
      });
    }

    user.picture = picture;
    await user.save();

    return res.json({
      message: 'User updated',
      data: user,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

export async function profilePicture(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: 'No token provided',
      });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'Not found',
      });
    }

    return res.json({
      message: 'User picture',
      data: user.picture,
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

async function usersSetup() {
  const allUsers = await User.find();
  allUsers.forEach(async (user) => {
    user.picture =
      'https://res.cloudinary.com/dzdvous3v/image/upload/v1701630791/moniepaddy/6544f1ced8e5feb4b004943a-pic3-1701630771000.jpg';
    await user.save();
  });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token');
  res.json({
    message: 'Logged out successfully',
    data: 'none',
  });
}

function runCommand() {
  usersSetup()
    .then(() => console.log('users modified'))
    .catch(() => console.error('something went wrong'));
}

// runCommand();
