import { Request, Response } from 'express';
import UserService from '../service/UserService';

class UserController {
    async login(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            const loginResult = await UserService.login(username, password);
            res.json(loginResult);
        } catch (e: any) {
            console.log(e.message);
            res.status(401).json({ message: e.message });
        }
    }

    async create(req: Request, res: Response) {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ message: 'Username, password and role are required' });
        }

        try {
            const newUser = await UserService.create(username, password, role);
            res.status(201).json(newUser);
        } catch (e: any) {
            console.log(e.message);
            res.status(500).json({ message: e.message });
        }
    }
}

export default new UserController();