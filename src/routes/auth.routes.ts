import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { validateLogin } from '../validations/api.validation';

const router = Router();

router.post('/login', validateLogin, login);

export default router;
