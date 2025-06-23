import express from 'express';
import * as requestMovementController from '../controllers/requestMovement.controller';
import { validateCreateRequestMovement, validateUpdateRequestMovement } from '../validations/api.validation';

const router = express.Router();

router.get('/request-movements', requestMovementController.getRequestMovements);

router.post(
    '/request-movements',
    validateCreateRequestMovement,
    requestMovementController.createRequestMovement
);

router.put(
    '/request-movements/:id',
    validateUpdateRequestMovement,
    requestMovementController.updateRequestMovement
);

router.delete('/request-movements/:id', requestMovementController.deleteRequestMovement);

export default router;
