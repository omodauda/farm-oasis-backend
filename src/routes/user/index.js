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

export default router;
