import { Router } from 'express';
import * as requestsTypesController from '../controllers/requestType-controller';
import { validateRequestType } from '../validations/api.validation'; // see validations section
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', requestsTypesController.getRequestTypes);
router.post('/', validateRequestType, requestsTypesController.createRequestType);
router.put('/:id', authMiddleware, validateRequestType, requestsTypesController.updateRequestType);
router.delete('/:id', authMiddleware, requestsTypesController.deleteRequestTypeById);
router.get('/report', authMiddleware, requestsTypesController.fetchRequestTypesReport);

export default router;
