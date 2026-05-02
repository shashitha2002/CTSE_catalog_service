import express, {type Application, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bookRoutes from './routes/bookRoutes.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ service: 'Book Catalog Service', status: 'UP' });
});

// Routes
//new comment
app.use('/api/books', bookRoutes);

export default app;