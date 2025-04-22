import { Router } from 'express';
import { changePassword, login } from '../controllers/auth.controller';
import { validateChangePassword, validateLogin } from '../validations/api.validation';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', validateLogin, login);

router.post(
    "/change-password",
    authMiddleware,
    validateChangePassword,
    changePassword
)

export default router;
