import express from 'express';
import * as transaction from '../controllers/transaction';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/airtime', auth, transaction.buyAirtime);
router.get('/balance', auth, transaction.getBalance);
router.post('/fund', auth, transaction.fundWallet);
router.post('/transfer', auth, transaction.bankTransfer);
router.get('/networks', auth, transaction.listNetworks);
router.get('/data', auth, transaction.listDataPlans);
router.post('/data', auth, transaction.buyData);
router.get('/all', auth, transaction.getTransactions);
router.get('/transfer', auth, transaction.getTransferDetails);

export default router;
