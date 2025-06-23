import { Request, Response, NextFunction } from 'express';
import * as movementService from '../services/requestMovement.service';


export const getRequestMovements = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId, assignedToId, page, pageSize, order } = req.query;

        let skip: number | undefined, take: number | undefined;
        if (page && pageSize) {
            const p = parseInt(page as string, 10);
            const ps = parseInt(pageSize as string, 10);
            if (!isNaN(p) && !isNaN(ps)) {
                skip = (p - 1) * ps;
                take = ps;
            }
        }
        const orderBy = order === 'asc' ? { date: 'asc' as const } : { date: 'desc' as const };
        const movements = await movementService.fetchRequestMovements({
            requestId: requestId as string | undefined,
            assignedToId: assignedToId as string | undefined,
            skip,
            take,
            orderBy,
        });
        res.json(movements);
    } catch (error) {
        next(error);
    }
};

export const createRequestMovement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId, assignedToId, date } = req.body;
        const movement = await movementService.createRequestMovementAndUpdateRequest({
            requestId,
            assignedToId,
            date: date ? new Date(date) : undefined,
        });
        res.status(201).json(movement);
    } catch (error) {
        next(error);
    }
};

export const updateRequestMovement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { assignedToId, date } = req.body;
        const updated = await movementService.updateRequestMovement(id, {
            assignedToId,
            date: date ? new Date(date) : undefined,
        });
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

export const deleteRequestMovement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await movementService.deleteRequestMovementById(id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
