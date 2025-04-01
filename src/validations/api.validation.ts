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
    orderBy: Joi.object().pattern(
        Joi.string(),
        Joi.string().valid('asc', 'desc')
    ).optional(),
    search: Joi.string().optional().allow(''),
    filters: Joi.object().optional(),
});
