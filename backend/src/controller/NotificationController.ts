import { Request, Response } from 'express';
import NotificationService from '../service/NotificationService';

class NotificationController {
    async getAll(req: Request, res: Response) {
        try {
            const banks = await NotificationService.getAll()
            return res.status(200).json(banks)
        } catch (error) {
            throw error
        }
    }

    async create(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Create Notification")
        const { notifications } = req.body

        if (!notifications) {
            console.log("Nenhum Nome de banco foi enviado")
        }

        const newBank = await NotificationService.create(notifications)
        return res.status(200).json(newBank)
    }

    async update(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Update Notification")
        const { notifications } = req.body

        const newReports = await NotificationService.update(notifications)
        return res.status(200).json(newReports)
    }

    async delete(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Delete Notification")
        const { id } = req.params

        await NotificationService.delete(Number(id))

        return res.status(200).json({ message: "Excluído com sucesso" })
    }
}

export default new NotificationController()