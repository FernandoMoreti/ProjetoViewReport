import { Router } from 'express';
import bankRouter from './bank.routes';
import reportRouter from './report.routes';

const routes = Router();

routes.use('/banks', bankRouter);
routes.use('/reports', reportRouter);

export default routes;