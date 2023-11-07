import express from 'express';
import {
  createPin,
  dashboard,
  completeRegistration,
} from '../controllers/user';
import { auth } from '../middleware/auth';
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({
    message: 'respond with a resource',
    data: '',
  });
});

router.get('/dashboard', auth, dashboard);

router.post('/register', auth, completeRegistration);

router.put('/create-pin', auth, createPin);

export default router;
