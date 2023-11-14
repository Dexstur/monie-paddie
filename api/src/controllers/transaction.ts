import { Request, Response } from 'express';
import { config } from 'dotenv';
import Transaction from '../models/transaction';
import {
  airtimeValidator,
  options,
  validBankTransfer,
} from '../utils/validation';
import User from '../models/user';
import Bcrypt from 'bcryptjs';
import { calculateBalance } from '../utils/utils';
import axios from 'axios';
import { buyAirtimeFromBloc } from '../utils/bloc';

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
  const amountInKobo = amount * 100;
  try {
    const userBalance = await calculateBalance(userId);
    user.balance = userBalance;
    await user.save();
    if (
      user.transactionPin !== transactionPin &&
      !Bcrypt.compareSync(transactionPin, user.transactionPin)
    ) {
      return res.status(400).json({ message: 'Invalid transaction pin' });
    }
    if (userBalance < amountInKobo) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    // call the airtime api (blochq)
    const response = await buyAirtimeFromBloc(
      amountInKobo,
      phoneNumber,
      network,
    );
    if (!response.success){
      return res.status(400).json(response);
    }

    const { status, reference } = response.data;

    // create a new transaction
    const transaction = new Transaction({
      amount: amountInKobo,
      phoneNumber,
      network,
      userId,
      transactionType: 'airtime',
      credit: false,
      reference,
      status,
    });

    await transaction.save();
    if (status !== 'successful') {
      return res.status(400).json({
        message: 'Your airtime purchase was unsuccessful',
        data: transaction,
      });
    }

    user.balance -= amount;
    await user.save();
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

export async function bankTransfer(req: Request, res: Response) {
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

    const { error } = validBankTransfer.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Transaction failed',
        error: error.message,
      });
    }
    const { amount, bankName, accountName, accountNumber, note, pin } =
      req.body;

    const validPin = Bcrypt.compareSync(pin, user.transactionPin);
    if (!validPin) {
      return res.status(403).json({
        message: 'Transaction failed',
        error: 'Invalid credentials',
      });
    }

    const balance = await calculateBalance(req.user);

    if (balance < amount) {
      return res.status(409).json({
        message: 'Transaction failed',
        error: 'Insufficient funds',
      });
    }

    const transfer = await Transaction.create({
      userId: req.user,
      amount,
      accountName,
      accountNumber,
      bankName,
      transactionType: 'transfer',
      credit: false,
      note,
    });

    return res.json({
      message: 'Transfer successful',
      data: transfer,
    });
  } catch (err: any) {
    console.error('Internal server error: ', err.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

export async function searchTransactions(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'No token provided',
        error: 'Unauthorised',
      });
    }

    const searchQuery = req.query.search as string;

    const transactions = await Transaction.find({
      $or: [
        { bankName: { $regex: searchQuery, $options: 'i' } },
        { accountNumber: { $regex: searchQuery, $options: 'i' } },
        { accountName: { $regex: searchQuery, $options: 'i' } },
        // Add other fields you want to search by
      ],
    });

    return res.json({
      message: 'Transactions',
      data: transactions,
    });
  } catch (err: any) {
    console.error('Internal server error: ', err.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
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
