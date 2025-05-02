import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phone, password } = req.body;
        const result = await authService.submitLoginRequest(phone, password);
        res.json({ ...result, user: {} });
    } catch (error) {
        next(error);
    }
};

export const studentLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phone, password } = req.body;
        const result = await authService.submitStudentLoginRequest(phone, password);
        res.json({ ...result, user: {} });
    } catch (error) {
        next(error);
    }
}

export const changePassword = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body

        const result = await authService.changePassword(
            userId,
            currentPassword,
            newPassword
        )
        res.json(result)
    } catch (err) {
        next(err)
    }
}

export const changeStudentPassword = async (
    req: any,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body

        const result = await authService.changeStudentPassword(
            userId,
            currentPassword,
            newPassword
        )
        res.json(result)
    } catch (err) {
        next(err)
    }
}