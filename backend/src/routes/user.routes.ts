import { Router } from 'express';
import UserController from '../controller/UserController';

const app = Router();

app.post('/login', UserController.login);
app.post('/create', UserController.create);

export default app;