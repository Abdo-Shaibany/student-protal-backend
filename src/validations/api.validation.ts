import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const departmentSchema = Joi.object({
    name: Joi.string().required(),
});

export const validateDepartment = (req: Request, res: Response, next: NextFunction) => {
    const { error } = departmentSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return
    }
    next();
};

const loginSchema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().required(),
});

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    pageSize: Joi.number().integer().min(1).default(10),
    orderBy: Joi.string().optional(),
    search: Joi.string().optional().allow(''),
    filters: Joi.string().optional(),
});

export const requestSubmissionSchema = Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    title: Joi.string().required(),
    departmentId: Joi.string().required(),
    message: Joi.string().required(),
});

export const updateRequestStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'inProgress', 'completed').required(),
    comment: Joi.string().optional(),
});

export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = paginationSchema.validate(req.query);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export const validateRequestSubmission = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = requestSubmissionSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export const validateUpdateRequestStatus = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = updateRequestStatusSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export const userCreateSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    departmentId: Joi.string().required(),
    password: Joi.string().required(),
    isAdmin: Joi.boolean().optional(),
});

export const userUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    departmentId: Joi.string().optional(),
    password: Joi.string().optional(),
    isAdmin: Joi.boolean().optional(),
    id: Joi.string().required(),
});

export const validateUserCreate = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = userCreateSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction): void => {
    const { error } = userUpdateSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};