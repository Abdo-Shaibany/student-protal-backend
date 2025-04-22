import { Request, Response, NextFunction } from 'express';
import * as requestsTypesService from '../services/requestTypes.service';

export const getRequestTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const departments = await requestsTypesService.fetchRequestsTypes();
        res.json(departments);
    } catch (error) {
        next(error);
    }
};

export const createRequestType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dept = await requestsTypesService.createRequestType(req.body);
        res.status(201).json(dept);
    } catch (error) {
        next(error);
    }
};

export const updateRequestType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const dept = await requestsTypesService.updateRequestType(id, req.body);
        res.json(dept);
    } catch (error) {
        next(error);
        console.log(error);
    }
};

export const deleteRequestTypeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await requestsTypesService.deleteRequestTypeById(id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const fetchRequestTypesReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const report = await requestsTypesService.fetchRequestTypesReport();
        res.json(report);
    } catch (error) {
        next(error);
    }
};
