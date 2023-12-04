import express from 'express';
import {
  createPin,
  dashboard,
  completeRegistration,
  updateUser,
  profilePicture,
} from '../controllers/user';
import { auth } from '../middleware/auth';
import { picUpload } from '../middleware/pic';
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

router.put('/', [auth, picUpload], updateUser);

router.get('/picture', auth, profilePicture);

export default router;
