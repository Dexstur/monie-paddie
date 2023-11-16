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
import dev from '../utils/logs';
import {
  NetworkItem,
  Network,
  DataPlan,
  DataMeta,
  PlanReturn,
} from '../config/types';

config();

const ps_secret = process.env.PAYSTACK_SECRET;
const bloq_secret = process.env.BLOCHQ_TOKEN;

/**Server logic for buy airtime */
export async function buyAirtime(req: Request, res: Response) {
  const userId = req.user;
  const { error } = airtimeValidator.validate(req.body, options);
  if (error) {
    return res
      .status(400)
      .json({ message: 'Bad request', error: error.message });
  }

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
      return res.status(403).json({
        message: 'Purchase failed',
        error: 'Invalid transaction pin',
      });
    }
    if (userBalance < amountInKobo) {
      return res.status(400).json({
        message: 'Purchase failed',
        error: 'Insufficient balance',
      });
    }

    const appState = 'testing';

    if (appState === 'testing') {
      const dudTransaction = await Transaction.create({
        amount: amountInKobo,
        phoneNumber,
        network,
        userId,
        transactionType: 'airtime',
        credit: false,
      });

      return res.json({
        message: 'Purchase successful',
        data: dudTransaction,
      });
    }
    // call the airtime api (blochq)
    const response = await buyAirtimeFromBloc(
      amountInKobo,
      phoneNumber,
      network,
    );
    if (!response.success) {
      dev.log(response);
      return res.status(501).json(response);
    }

    const { status, reference } = response.data;

    if (status !== 'successful') {
      return res.status(503).json({
        message: 'Your airtime purchase was unsuccessful',
      });
    }

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

export function listNetworks(req: Request, res: Response) {
  try {
    const Authorization = `Bearer ${bloq_secret}`;
    axios
      .get('https://api.blochq.io/v1/bills/operators?bill=telco', {
        headers: {
          Authorization,
        },
      })
      .then((response) => {
        const { success } = response.data;
        if (success) {
          const summary = response.data.data.map((item: NetworkItem) => ({
            name: item.name,
            id: item.id,
          }));
          return res.json({
            message: 'Networks',
            data: summary,
          });
        } else {
          return res.status(502).json({
            message: 'Networks unavailable',
            error: 'Could not fetch networks',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(502).json({
          message: 'Networks unavailable',
          error: 'Could not fetch networks',
        });
      });
  } catch (err: any) {
    console.error('Internal server error: ', err.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

export async function listDataPlans(req: Request, res: Response) {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        message: 'Bad request',
        error: 'Network id not provided',
      });
    }

    const Authorization = `Bearer ${bloq_secret}`;

    axios
      .get(
        `https://api.blochq.io/v1/bills/operators/${id}/products?bill=telco`,
        {
          headers: {
            Authorization,
          },
        },
      )
      .then((response) => {
        const { success } = response.data;
        if (success) {
          const plans: PlanReturn[] = [];
          response.data.data.forEach((item: DataPlan) => {
            if (item.fee_type === 'FIXED') {
              const formatFee = item.meta.fee.split('.')[0];
              item.meta.fee = formatFee;
              plans.push({ id: item.id, meta: item.meta });
            }
          });
          return res.json({
            message: 'Data Plans',
            data: plans,
          });
        } else {
          return res.status(502).json({
            message: 'Data Plans unavailable',
            error: 'Could not fetch data plans',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(502).json({
          message: 'Data Plans unavailable',
          error: 'Could not fetch data plans',
        });
      });
  } catch (err: any) {
    console.error('Internal server error: ', err.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

export async function buyData(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorised',
        error: 'No token provided',
      });
    }

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        message: 'Transaction failed',
        error: 'User not found',
      });
    }

    const { network, plan, phoneNumber, pin, provider } = req.body;

    if (!(network && plan && phoneNumber && pin && provider)) {
      return res.status(400).json({
        message: 'Bad Request',
        error: 'Required fields not provided',
      });
    }

    const validPin = Bcrypt.compareSync(pin, user.transactionPin);

    if (!validPin) {
      return res.status(403).json({
        message: 'Transaction failed',
        error: 'Invalid credentials',
      });
    }

    const balance = await calculateBalance(req.user);

    const Authorization = `Bearer ${bloq_secret}`;

    axios
      .get(
        `https://api.blochq.io/v1/bills/operators/${network}/products?bill=telco`,
        {
          headers: {
            Authorization,
          },
        },
      )
      .then((response) => {
        const plans: DataPlan[] = response.data.data;
        const userPlan = plans.find((data) => data.id === plan);
        if (!userPlan) {
          return res.status(400).json({
            message: 'Bad request',
            error: 'Data plan not found',
          });
        }

        const stringAmount = userPlan.meta.fee.split('.').join('');
        const dataCost = Number(stringAmount);
        if (balance <= dataCost) {
          return res.status(409).json({
            message: 'Transaction failed',
            error: 'Insufficient funds',
          });
        }

        const transaction = new Transaction({
          transactionType: 'data',
          amount: dataCost,
          userId: req.user,
          credit: false,
          bankName: provider,
          accountName: 'Data',
          dataPlan: plan,
        });
        transaction.save();
        return res.json({
          message: 'Purchase successful',
          data: transaction,
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(502).json({
          message: 'Transaction failed',
          error: 'Could not make data purchase',
        });
      });
  } catch (err: any) {
    console.error('Internal server error: ', err.message);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message,
    });
  }
}

export async function getTransactions(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "No token provided",
        error: "Unauthorised",
      });
    }
    const { search, filter, page = 1, pageSize = 10 } = req.query;
    let query: any = { userId: req.user}
    if (search) {
      query.$or = [
        {transactionType: {$regex: search as string, $options: 'i'}},
        { accountName: { $regex: search as string, $options: 'i' } },
        { accountNumber: { $regex: search as string, $options: 'i' } },
        { bankName: { $regex: search as string, $options: 'i' } },
        { phoneNumber: { $regex: search as string, $options: 'i' } },
        { network: { $regex: search as string, $options: 'i' } },
        { dataPlan: { $regex: search as string, $options: 'i' } },
        { electricityMeterNo: { $regex: search as string, $options: 'i' } },
        { note: { $regex: search as string, $options: 'i' } },
      ];
    }
    if (filter === "successful" || filter === "failed") {
      query.status = filter;
    }
    if (filter === "true" || filter === "false") {
      query.credit = filter;
    }
    if ( filter === "all") {
      query = {}
    }

    const skip = (Number(page) - 1) * Number(pageSize);

     console.log('Query:', query);

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(pageSize));

      const total = await Transaction.countDocuments(query);
    console.log('Transactions:', transactions);

    return res.json({
      message: "Transactions",
      data: transactions,
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      totalPages: Math.ceil(total / Number(pageSize)),
    });
  }catch (err: any) {
    console.error("Internal server error: ", err.message);
    return res.status(500).json({
      message: "Internal server error",
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
