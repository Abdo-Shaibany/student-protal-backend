import { Router } from 'express';
import * as departmentController from '../controllers/department.controller';
import { validateDepartment } from '../validations/api.validation'; // see validations section
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', departmentController.getDepartments);
router.post('/', validateDepartment, departmentController.createDepartment);
router.put('/:id', authMiddleware, validateDepartment, departmentController.updateDepartment);
router.delete('/:id', authMiddleware, departmentController.deleteDepartment);
router.get('/report', authMiddleware, departmentController.getDepartmentReport);

export default router;
