import { Request, Response } from 'express';
import BankService from "../service/bankService";

class BankController {
    async getAll(req: Request, res: Response) {
        try {
            const banks = await BankService.getAll()
            return res.status(200).json(banks)
        } catch (error) {
            throw error
        }
    }

    async getByName(req: Request, res: Response) {
        const { bank } = req.query || ""

        if (!bank) {
            console.log("nenhum banco foi enviado")
        }

        const banks = await BankService.getByName(bank)
        return banks
    }

    async create(req: Request, res: Response) {
        const { bank } = req.body

        if (!bank) {
            console.log("Nenhum Nome de banco foi enviado")
        }

        const newBank = await BankService.create(bank)
        return res.status(200).json(newBank)
    }
}

export default new BankController()