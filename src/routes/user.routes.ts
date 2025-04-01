import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { validateUserCreate, validateUserUpdate } from '../validations/api.validation';

const router = Router();

// GET /api/users - List users (accessible by authenticated users)
router.get('/', authMiddleware, userController.getUsers);

// POST /api/users - Create a new user (admin only)
router.post('/', authMiddleware, adminMiddleware, validateUserCreate, userController.createUser);

// PUT /api/users/:id - Update an existing user (admin only)
router.put('/:id', authMiddleware, adminMiddleware, validateUserUpdate, userController.updateUser);

// DELETE /api/users/:id - Delete a user (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

export default router;
