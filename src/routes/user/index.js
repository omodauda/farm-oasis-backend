import { Router } from 'express';
import UserController from '../../controllers/user';
import authenticate from '../../middlewares/auth';
import { validateBody, schema } from '../../validations';

const router = new Router();

router
  .route('/user/signup')
  .post(validateBody(schema.signup), UserController.createUser);

router
  .route('/user/login')
  .post(validateBody(schema.login), UserController.loginUser);

router
  .route('/user/verify')
  .post(validateBody(schema.verifyUser), authenticate, UserController.verifyUser);

router
  .route('/user/resend-token')
  .get(authenticate, UserController.resendConfirmationToken);

router
  .route('/user/forget-password')
  .post(validateBody(schema.forgetPassword), UserController.forgetPassword);

router
  .route('/user/reset-password')
  .post(validateBody(schema.resetPassword), UserController.resetPassword);

router
  .route('/user/refresh-token')
  .post(UserController.refreshAccessToken);

export default router;
