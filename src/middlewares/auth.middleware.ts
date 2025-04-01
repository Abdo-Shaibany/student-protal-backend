import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

export interface AuthRequest extends Request {
    user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Authorization token missing' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
};

// Additional middleware for admin-only endpoints
export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ error: 'Admin privileges required' });
    }
};

// For employee endpoints where isAdmin is false:
export const employeeMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && !req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json({ error: 'Employee access required' });
    }
};
