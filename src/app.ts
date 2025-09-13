import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import { requireAuth } from './middlewares/auth';
import { errorHandler } from './middlewares/errorHandler';
import router from './routes';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", router);

app.get("/", requireAuth, (req: Request, res: Response) => {
    res.status(200).json({ message: "SpaceTip backend endpoint" });
});

app.use(errorHandler);

export default app;