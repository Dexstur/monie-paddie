import { Response } from 'express';
import Jwt from 'jsonwebtoken';
import { IUser } from '../models/user';
import Transaction from '../models/transaction';
import { config } from 'dotenv';
import mongoose from 'mongoose';

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

// export async function calculateBalance(userId: string) {
//   const allTransactions = await Transaction.find({ userId });
//   let balance = 0;
//   if (allTransactions.length === 0) {
//     return balance;
//   }

//   allTransactions.forEach((entry) => {
//     entry.credit ? (balance += entry.amount) : (balance -= entry.amount);
//   });

//   return balance;
// }

export async function calculateBalance(userId: string) {
  const pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalCredit: {
          $sum: { $cond: { if: '$credit', then: '$amount', else: 0 } },
        },
        totalDebit: {
          $sum: {
            $cond: { if: { $not: '$credit' }, then: '$amount', else: 0 },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        balance: { $subtract: ['$totalCredit', '$totalDebit'] },
      },
    },
  ];

  const result = await Transaction.aggregate(pipeline);

  // Extract the balance from the result (default to 0 if no transactions)
  const balance = result.length > 0 ? result[0].balance : 0;

  return balance;
}

// data from BlocHQ API
export const TELCOS = [
  {
    desc: 'MTN Nigeria',
    id: 'op_xoaaKAWhcZ3RwGfMKjpmag',
    name: 'MTN',
    sector: 'Telecommunications',
    airtimeProductId: 'prd_veH4vW7gbaLdxGpKdVANhF',
  },
  {
    desc: 'Airtel Nigeria',
    id: 'op_j3S5RJ2ZJYvfvchYq3fpFU',
    name: 'Airtel',
    sector: 'Telecommunications',
    airtimeProductId: 'prd_rym8FLVQosR6oGbZmPHcAm',
  },
  {
    desc: '9Mobile Nigeria',
    id: 'op_6ZwjemDTAYz5mZWJMLFRGc',
    name: '9Mobile',
    sector: 'Telecommunications',
    airtimeProductId: 'prd_AQXbGT8cGyswrC5y3s2HcC',
  },
  {
    desc: 'Globacom (Glo Nigeria)',
    id: 'op_6jYrpyHjJoG2SdeyfzmMSS',
    name: 'Glo',
    sector: 'Telecommunications',
    airtimeProductId: 'prd_M4nj7jc5kT58dJ8SqViii4',
  },
  {
    desc: 'Visafone Nigeria',
    id: 'op_jDMM6BQrbmVfS6eqXytVAL',
    name: 'Visafone',
    sector: 'Telecommunications',
    airtimeProductId: 'prd_meV2cEbdsDmf6wKRjo4oyA',
  },
];

export const DISCOS = [
  {
    desc: 'Ibadan Electricity Distribution Company',
    id: 'op_deR4dx7V5B28Fn5Pij9ach',
    name: 'IBEDC',
    sector: 'Electricity',
  },
  {
    desc: 'Kano Electricity Distribution Company',
    id: 'op_8uNjD7x8s2SnSwPzquEcQi',
    name: 'KEDCO',
    sector: 'Electricity',
  },
  {
    desc: 'Aba Power Limited Electric',
    id: 'op_7VCucgjYSDXrKKfDBrDey8',
    name: 'APLE',
    sector: 'Electricity',
  },
  {
    desc: 'AES Jos Electricity Distribution Company',
    id: 'op_5rYjsdbMtTkgu7bcnkXuai',
    name: 'AES_JEDC',
    sector: 'Electricity',
  },
  {
    desc: 'CEL Jos Electricity Distribution Company',
    id: 'op_pQJjkwnwhXrRdanyfvrXYB',
    name: 'CEL_JEDC',
    sector: 'Electricity',
  },
  {
    desc: 'Benin Electricity Distribution Company',
    id: 'op_kXdyUvFZVzMgXDoFJabrv4',
    name: 'BEDC',
    sector: 'Electricity',
  },
  {
    desc: 'Eko Electricity Distribution Company',
    id: 'op_xctXVabViUHmyLPdW9fDFJ',
    name: 'EKEDC',
    sector: 'Electricity',
  },
  {
    desc: 'Kaduna Electricity Distribution Company',
    id: 'op_D4M9raYX3QGQ2eXCphkfB2',
    name: 'KAEDCO',
    sector: 'Electricity',
  },
  {
    desc: 'Abuja Electricity Distribution Company',
    id: 'op_sBaoehA7TQCy8igjYKfC6v',
    name: 'AEDC',
    sector: 'Electricity',
  },
  {
    desc: 'Port Harcourt Electricity Distribution Company',
    id: 'op_4NHWfrNyzT5kN8GsQYTZot',
    name: 'PHEDC',
    sector: 'Electricity',
  },
  {
    desc: 'Ikeja Electricity Distribution Company',
    id: 'op_RszwtPMnaooVgCsEcJWcEF',
    name: 'IKEDC',
    sector: 'Electricity',
  },
  {
    desc: 'Enugu Electricity Distribution Company',
    id: 'op_gprNgsEdQFeQ6K4p7ELSwS',
    name: 'EEDC',
    sector: 'Electricity',
  },
];
