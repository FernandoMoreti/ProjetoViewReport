import { Router } from 'express';
import bankRouter from './bank.routes';
import reportRouter from './report.routes';
import dayRouter from './daysofweek.routes'
import ticketRouter from './ticket.routes'

const routes = Router();

routes.use('/banks', bankRouter);
routes.use('/reports', reportRouter);
routes.use('/dayofweek', dayRouter);
routes.use('/tickets', ticketRouter);

export default routes;