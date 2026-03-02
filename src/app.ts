import express, {type Application, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
//import bookRoutes from './routes/bookRoutes';

const app: Application = express();

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors());
app.use(morgan('dev')); // Logs requests to the console
app.use(express.json());

// Health Check (For Cloud Providers like Render to know the service is alive)
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ service: 'Book Catalog Service', status: 'UP' });
});

// Routes
//app.use('/api/books', bookRoutes);

export default app;