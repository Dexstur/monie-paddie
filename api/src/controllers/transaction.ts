import { Request, Response } from 'express';
import { config } from 'dotenv';
import Transaction from '../models/transaction';
import { airtimeValidator, options } from '../utils/validation';
import User from '../models/user';
import Bcrypt from 'bcryptjs';
import { calculateBalance } from '../utils/utils';
import axios from 'axios';

config();

const ps_secret = process.env.PAYSTACK_SECRET;

/**Server logic for buy airtime */
export async function buyAirtime(req: Request, res: Response) {
  const userId = req.user;
  const { error } = airtimeValidator.validate(req.body, options);
  if (error) return res.status(400).json({ message: error.message });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { amount, phoneNumber, network, transactionPin } = req.body;
  try {
    if (
      user.transactionPin !== transactionPin &&
      !Bcrypt.compareSync(transactionPin, user.transactionPin as string)
    ) {
      return res.status(400).json({ message: 'Invalid transaction pin' });
    }
    if (user.balance < amount)
      return res.status(400).json({ message: 'Insufficient balance' });
    const transaction = new Transaction({
      amount,
      phoneNumber,
      network,
      userId,
      transactionType: 'airtime',
    });
    transaction.save();
    user.balance -= amount;
    user.save();
    res.json({
      message: 'Your airtime purchase was successful',
      data: transaction,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
}

export async function getBalance(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'No token found',
        error: 'Unauthorised',
      });
    }
    const userId = req.user;

    const balance = await calculateBalance(userId);

    return res.json({
      message: 'User balance',
      data: balance,
    });
  } catch (error: any) {
    console.error('Error calculating balance:', error);
    res
      .status(500)
      .json({ message: 'Error calculating balance', error: error.message });
  }
}

export async function fundWallet(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'No token provided',
        error: 'Unauthorised',
      });
    }
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        message: 'Cannot process transaction',
        error: 'User not found',
      });
    }

    const { reference } = req.body;
    const Authorization = `Bearer ${ps_secret}`;

    const processed = await Transaction.findOne({ reference });
    if (processed) {
      return res.status(409).json({
        message: 'Stale transaction',
        error: 'This transaction has been processed already',
      });
    }

    axios
      .get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization,
        },
      })
      .then(async (response) => {
        if (response.data.status) {
          const creditAmount = response.data.data.amount;
          const funds = new Transaction({
            amount: creditAmount,
            reference,
            bankName: 'Sure Banker',
            accountName: 'Monie Paddy',
            credit: true,
            userId: req.user,
            transactionType: 'fund wallet',
          });
          funds.save();
          return res.json({
            message: 'Success',
            data: creditAmount,
          });
        }
      })
      .catch((error) => {
        console.error(`Error funding ${user.email} wallet:`, error);
        return res.status(500).json({
          message: 'Transaction failed',
          error: 'Could not confirm transaction',
        });
      });
  } catch (err: any) {
    console.error('Internal server error: ', err.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
}

function runCommand() {
  axios
    .get(`https://api.paystack.co/transaction/verify/T191080192909981`, {
      headers: {
        Authorization: `Bearer ${ps_secret}`,
      },
    })
    .then((response) => {
      console.log('Response:', response.data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
