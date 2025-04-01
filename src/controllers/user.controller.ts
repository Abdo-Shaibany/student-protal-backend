import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

/**
 * GET /api/users
 * Fetch all users.
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { search, orderBy } = req.query
    try {
        const users = await userService.fetchUsers(search as string | undefined, orderBy as string | undefined);
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
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, phone, departmentId, password, isAdmin } = req.body;
        const newUser = await userService.createUser({ name, phone, departmentId, password, isAdmin });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/users/:id
 * Update an existing user.
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedUser = await userService.updateUser(id, req.body);
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/users/:id
 * Delete a user.
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
