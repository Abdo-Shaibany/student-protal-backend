import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { phone, password } = req.body;
        const result = await authService.submitLoginRequest(phone, password);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
