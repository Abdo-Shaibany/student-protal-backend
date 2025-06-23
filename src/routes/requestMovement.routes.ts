import express from 'express';
import * as requestMovementController from '../controllers/requestMovement.controller';
import { validateCreateRequestMovement, validateUpdateRequestMovement } from '../validations/api.validation';

const router = express.Router();

router.get('/', requestMovementController.getRequestMovements);

router.post(
    '/',
    validateCreateRequestMovement,
    requestMovementController.createRequestMovement
);

router.put(
    '/:id',
    validateUpdateRequestMovement,
    requestMovementController.updateRequestMovement
);

router.delete('/:id', requestMovementController.deleteRequestMovement);

export default router;
