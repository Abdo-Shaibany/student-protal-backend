import { Request, Response, NextFunction } from 'express';
import * as requestService from '../services/request.service';
import * as departmentService from '../services/department.service';
import * as userService from '../services/user.service';
import * as fileService from '../services/files.service';
import * as requestTypeService from '../services/requestTypes.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/requests
 * Get a paginated list of requests.
 * Expects query parameters: page, pageSize, orderBy, search, filters.
 */
export const getRequests = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Extract query parameters
        const { page, pageSize, orderBy, search, filters } = req.query;
        const pagination = {
            page: Number(page) || 1,
            pageSize: Number(pageSize) || 10,
            orderBy: orderBy ? JSON.parse(orderBy as string) : undefined,
            search: search ? search as string : undefined,
            filters: filters ? JSON.parse(filters as string) : undefined,
        };

        // Scope the fetching based on the user's role (if user is non-admin, apply department & assignedTo filter)
        const result = await requestService.fetchRequests(pagination, req.user);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/requests/:id
 * Get a single request by its ID.
 */
export const getRequestById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const requestItem = await requestService.fetchRequestById(id);
        if (!requestItem) {
            res.status(404).json({ error: 'Request not found' });
            return;
        }
        res.json(requestItem);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/requests/:id/status
 * Update a request's status.
 * Expects body payload: { status: RequestStatus, comment?: string }
 */
export const updateRequestStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, comment } = req.body;
        const updatedRequest = await requestService.updateRequestStatus(id, status, comment);
        res.json(updatedRequest);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/requests
 * Submit a new student request.
 * Expects body payload with student request data.
 */
export const submitStudentRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = req.body;
        const files = req.files;
        const user = await userService.getUserByDepartmentId(data.departmentId);
        const newRequest = await requestService.submitStudentRequest({ ...data, assignedToId: user?.id });
        if (files) {
            if (Array.isArray(files)) {
                for (const file of files) {
                    const requestFile = await fileService.createRequestFile({ name: file.originalname, type: 'image', url: file.path, requestId: newRequest.id });
                }
            } else if (files && typeof files === 'object') {
                for (const key in files) {
                    for (const file of files[key]) {
                        const requestFile = await fileService.createRequestFile({ name: file.originalname, type: 'image', url: file.path, requestId: newRequest.id });
                    }
                }
            }
        }
        await departmentService.updateDepartmentTotalRequests(data.departmentId);
        await requestTypeService.updateRequestTypeTotalRequests(data.requestTypeId);
        if (user)
            await userService.updateUserTotalRequests(user.id);

        res.status(201).json(newRequest);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/requests/daily-count
 * Fetch the daily count of requests.
 */
export const getDailyCounts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const dailyCounts = await requestService.fetchRequestCountsDaily();
        console.log(dailyCounts, " hi");
        res.json(dailyCounts);
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/requests/today-report
 * Get a report of today's requests (pending and late).
 */
export const getTodayReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const report = await requestService.getRequestTodayReport();
        res.json(report);
    } catch (error) {
        next(error);
    }
};
