import express, { Application, Response } from 'express';
import { logger } from './middleware/loggers';
import { rateLimiterMiddleware } from './middleware/limiter';
import { authRouter } from './auth/auth.route';
import { userRouter } from './user/user.route';
import cors from "cors"

const app: Application = express();

app.use(express.json({ type: "*/*" }));
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use(logger);
app.use(rateLimiterMiddleware);

//default route
app.get('/',(req: any,res:Response)=>{
    res.send('Welcome to Express API Backend with drizle ORM and PostgreSQL');
})


app.use('/api',authRouter);
app.use('/api',userRouter)


export default app