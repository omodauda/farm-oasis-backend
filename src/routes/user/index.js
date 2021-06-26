import { Router } from 'express';
import UserController from '../../controllers/user';

const router = new Router();

router.post('/user/signup', UserController.createUser);

export default router;
