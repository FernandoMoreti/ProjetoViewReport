import { Router } from 'express';
import bankRouter from './bank.routes';
import reportRouter from './report.routes';
import dayRouter from './daysofweek.routes'
import ticketRouter from './ticket.routes'
import validatorRouter from './validator.routes'
import proposalRouter from './proposal.routes'
import userRouter from './user.routes'
import notificationRouter from './notification.routes'

const routes = Router();

routes.use('/banks', bankRouter);
routes.use('/reports', reportRouter);
routes.use('/users', userRouter);
routes.use('/dayofweek', dayRouter);
routes.use('/tickets', ticketRouter);
routes.use('/valid', validatorRouter);
routes.use('/proposal', proposalRouter);
routes.use('/notification', notificationRouter);

export default routes;