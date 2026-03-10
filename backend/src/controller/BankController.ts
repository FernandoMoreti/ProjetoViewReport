import { Request, Response } from 'express';
import BankService from "../service/bankService";

class BankController {
    async index(req: Request, res: Response) {
        console.log("Controller acessado com sucesso")
        await BankService.index()
        return res.status(200)
    }
}

export default new BankController()