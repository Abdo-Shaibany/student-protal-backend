import { Request, Response, NextFunction } from 'express';
import * as departmentService from '../services/department.service';

export const getDepartments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const departments = await departmentService.fetchDepartments();
        res.json(departments);
    } catch (error) {
        next(error);
    }
};

export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dept = await departmentService.createDepartment(req.body);
        res.status(201).json(dept);
    } catch (error) {
        next(error);
    }
};

export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const dept = await departmentService.updateDepartment(id, req.body);
        res.json(dept);
    } catch (error) {
        next(error);
    }
};

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await departmentService.deleteDepartmentById(id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const getDepartmentReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const report = await departmentService.fetchDepartmentsReport();
        res.json(report);
    } catch (error) {
        next(error);
    }
};
