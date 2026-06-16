import { Request, Response } from 'express';
import TicketService from "../service/TicketService";

class TicketController {
    async getNotResolved(req: Request, res: Response) {
        try {
            console.log("Aqui")
            const banks = await TicketService.getNotResolved()
            return res.status(200).json(banks)
        } catch (error) {
            throw error
        }
    }

    async getCashflow(req: Request, res: Response) {
        try {
            const banks = await TicketService.getCashflow()
            return res.status(200).json(banks)
        } catch (error) {
            throw error
        }
    }

    async getResolved(req: Request, res: Response) {
        try {
            const banks = await TicketService.getResolved()
            return res.status(200).json(banks)
        } catch (error) {
            throw error
        }
    }

    async create(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Create Ticket")
        const { tickets } = req.body

        if (!tickets) {
            console.log("Nenhum Nome de banco foi enviado")
        }

        const newBank = await TicketService.create(tickets)
        return res.status(200).json(newBank)
    }

    async createCashflow(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Create Ticket Cashflow")
        const { idParceiro, proposal, phone } = req.body

        if (!idParceiro || !proposal || !phone) {
            console.log("Nenhum id de parceiro foi enviado")
        }

        const newCashflow = await TicketService.createCashflow(idParceiro, proposal, phone)
        return res.status(200).json(newCashflow)
    }

    async update(req: Request, res: Response) {
        console.log("ROTAS: Entrei no método Update Ticket")
        const { tickets } = req.body


        const newReports = TicketService.update(tickets)
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