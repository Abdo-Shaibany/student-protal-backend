import { Router } from 'express';
import { changePassword, changeStudentPassword, login, studentLogin } from '../controllers/auth.controller';
import { validateChangePassword, validateLogin } from '../validations/api.validation';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', validateLogin, login);

router.post('/student-login', validateLogin, studentLogin);

router.post(
    "/change-password",
    authMiddleware,
    validateChangePassword,
    changePassword
)

router.post(
    "/student-change-password",
    authMiddleware,
    validateChangePassword,
    changeStudentPassword
)

export default router;
