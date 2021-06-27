import { Router } from 'express';
import UserController from '../../controllers/user';
import authenticate from '../../middlewares/auth';

const router = new Router();

router
  .route('/user/signup')
  .post(UserController.createUser);

router
  .route('/user/login')
  .post(UserController.loginUser);

router
  .route('/user/verify')
  .post(authenticate, UserController.verifyUser);

router
  .route('/user/resend-token')
  .get(authenticate, UserController.resendConfirmationToken);

export default router;
