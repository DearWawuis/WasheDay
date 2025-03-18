import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller';
import { verifyToken, isAdmin } from '../middlewares/authJwt';

const router = Router();

router.post('/signup', authCtrl.signUp);
router.post('/signin', authCtrl.signIn);
router.get('/me', authCtrl.getUserInfo);

export default router;
