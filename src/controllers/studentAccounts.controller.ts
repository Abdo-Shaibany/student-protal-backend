import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/studentAcocunt.service';

/**
 * GET /api/users
 * Fetch all users.
 */
export const getStudentAccounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { search, orderBy } = req.query
    try {
        const users = await userService.fetchStudentAccounts(search as string | undefined, orderBy as string | undefined);
        res.json(users);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/users
 * Create a new user.
 * Expected payload: { name, phone, departmentId, password, isAdmin? }
 */
export const createStudentAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, phone, studentNo, password } = req.body;
        const newUser = await userService.createStudentAccount({ name, phone, studentNo, password });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/users/:id
 * Update an existing user.
 */
export const updateStudentAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedUser = await userService.updateStudentAccount(id, req.body);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/users/:id
 * Delete a user.
 */
export const deleteStudentAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        await userService.deleteStudentAccount(id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
