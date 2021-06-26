import { Router } from 'express';
import UserController from '../../controllers/user';

const router = new Router();

router.post('/user/signup', UserController.createUser);
router
  .route('/user/login')
  .post(UserController.loginUser);

export default router;
