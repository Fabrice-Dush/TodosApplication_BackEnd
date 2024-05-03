import express from 'express';
const router = express.Router();

import {
  loginGET,
  loginPOST,
  signupGET,
  signupPOST,
  logout,
  settings,
  deleteAccount,
} from './../controllers/users';
import { authenticate } from './../middleware/middleware';

router.route('/login').get(loginGET).post(loginPOST);
router.route('/signup').get(signupGET).post(signupPOST);

router.get('/logout', logout);
router.get('/settings', authenticate, settings);
router.delete('/deleteaccount', authenticate, deleteAccount);

module.exports = router;

export default router;
