import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import authRoutes from './modules/auth/auth.route'
import { requireAuth } from './middlewares/auth';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", requireAuth, (req: Request, res: Response) => {
    res.status(200).json({ message: "spacetip backend endpoint" });
});

app.use(errorHandler);

export default app;