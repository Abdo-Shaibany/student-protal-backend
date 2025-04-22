import express from 'express';
import cors from 'cors';
import departmentRoutes from './routes/department.routes';
import authRoutes from './routes/auth.routes';
import requestRoutes from './routes/request.routes';
import userRoutes from './routes/user.routes';
import requestTypes from './routes/requestType.route';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes mounting
app.use('/api/departments', departmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requestTypes', requestTypes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
