import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "spacetip backend endpoint" });
}); 

export default app;