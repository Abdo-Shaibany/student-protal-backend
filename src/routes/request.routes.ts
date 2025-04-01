import { Router } from 'express';
import * as requestController from '../controllers/request.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
    validatePagination,
    validateRequestSubmission,
    validateUpdateRequestStatus,
} from '../validations/api.validation';
import { upload } from '../middlewares/fileUpload.middleware';

const router = Router();

router.get('/daily-count', authMiddleware, requestController.getDailyCounts);

router.get('/today-report', authMiddleware, requestController.getTodayReport);

router.get('/', authMiddleware, validatePagination, requestController.getRequests);

router.get('/:id', authMiddleware, requestController.getRequestById);

router.put('/:id/status', authMiddleware, validateUpdateRequestStatus, requestController.updateRequestStatus);

router.post('/', upload.array('fileUpload'), validateRequestSubmission, requestController.submitStudentRequest);

export default router;
