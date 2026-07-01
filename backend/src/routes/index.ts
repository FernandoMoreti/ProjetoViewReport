import { Router } from 'express';
import bankRouter from './bank.routes';
import reportRouter from './report.routes';
import dayRouter from './daysofweek.routes'
import ticketRouter from './ticket.routes'
import validatorRouter from './validator.routes'
import userRouter from './user.routes'

const routes = Router();

routes.use('/banks', bankRouter);
routes.use('/reports', reportRouter);
routes.use('/users', userRouter);
routes.use('/dayofweek', dayRouter);
routes.use('/tickets', ticketRouter);
routes.use('/valid', validatorRouter);

export default routes;