import { Router } from 'express';
import * as studentAccountController from '../controllers/studentAccounts.controller';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';
import { validateStudentAccountCreate, validateStudentAccountUpdate } from '../validations/api.validation';

const router = Router();

// GET /api/users - List users (accessible by authenticated users)
router.get('/', authMiddleware, studentAccountController.getStudentAccounts);

// POST /api/users - Create a new user (admin only)
router.post('/', authMiddleware, adminMiddleware, validateStudentAccountCreate, studentAccountController.createStudentAccount);

// PUT /api/users/:id - Update an existing user (admin only)
router.put('/:id', authMiddleware, adminMiddleware, validateStudentAccountUpdate, studentAccountController.updateStudentAccount);

// DELETE /api/users/:id - Delete a user (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, studentAccountController.deleteStudentAccount);

export default router;
