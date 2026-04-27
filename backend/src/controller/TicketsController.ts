import { Request, Response } from 'express';
import TicketService from "../service/TicketService";

class TicketController {
    async getAll(req: Request, res: Response) {
        try {
            const banks = await TicketService.getAll()
            return res.status(200).json(banks)
        } catch (error) {
            throw error
        }
    }

    async create(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Create Ticket")
        const { bank, dateOfTicket, about, numTicket, resolved } = req.body[0]

        if (!bank) {
            console.log("Nenhum Nome de banco foi enviado")
        }

        const newBank = await TicketService.create(bank, dateOfTicket, about, numTicket, resolved)
        return res.status(200).json(newBank)
    }

    async update(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Update Ticket")
        const { id, bank, dateOfTicket, about, numTicket, resolved } = req.body

        const newReports = TicketService.update(id, bank, dateOfTicket, about, numTicket, resolved)
        return res.status(200).json(newReports)
    }

    async delete(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Delete Ticket")
        const { id } = req.params

        await TicketService.delete(Number(id))

        return res.status(200).json({ message: "Excluído com sucesso" })
    }
}

export default new TicketController()