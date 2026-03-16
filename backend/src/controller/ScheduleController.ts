import { Request, Response } from 'express';
import ScheduleService from "../service/ScheduleService";

class ScheduleController {
    async getAll(req: Request, res: Response) {
        try {
            const banks = await ScheduleService.getAll()
            return res.status(200).json(banks)
        } catch (error) {
            throw error
        }
    }

    async create(req: Request, res: Response) {
        const { bankId, dayOfWeek, time  } = req.body

        if (!bankId) {
            console.log("Nenhum Nome de banco foi enviado")
        }

        const newBank = await ScheduleService.create(bankId, dayOfWeek, time)
        return res.status(200).json(newBank)
    }

    async update(req: Request, res: Response) {
        const { id, bankId, dayOfWeek, time } = req.body

        const newReports = ScheduleService.update(id, bankId, dayOfWeek, time)
        return res.status(200).json(newReports)
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params

        await ScheduleService.delete(Number(id))

        return res.status(200).json({ message: "Excluído com sucesso" })
    }
}

export default new ScheduleController()