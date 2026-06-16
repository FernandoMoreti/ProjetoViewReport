import TicketRepository from "../repository/TicketRepository"
import { TicketCashflowAttributes } from "../Types/type"

class TicketService {
    async getNotResolved() {
        try {
            const banks = await TicketRepository.getNotResolved()
            return banks
        } catch (error) {
            throw error
        }
    }

    async getCashflow() {
        try {
            const banks = await TicketRepository.getCashflow()
            return banks
        } catch (error) {
            throw error
        }
    }

    async getResolved() {
        try {
            const banks = await TicketRepository.getResolved()
            return banks
        } catch (error) {
            throw error
        }
    }

    async create(tickets: any[]) {
        const newTicket = await TicketRepository.create(tickets)
        return newTicket
    }

    async createCashflow(idParceiro: number, proposal: string, phone: number) {

        const payload = {
            idParceiro,
            proposal,
            phone,
            obs: "",
            resolved: false
        }

        console.log(payload)

        const newCashflow = await TicketRepository.createCashflow(payload)
        return newCashflow
    }

    async update(tickets: any[]) {
        try {
            for (let ticket of tickets) {
                const { id, bank, dateOfTicket, about, numTicket, resolved } = ticket
                await TicketRepository.update({ id, bank, dateOfTicket, about, numTicket, resolved })
            }
            return 200
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async delete(id: number) {
        return await TicketRepository.delete(id)
    }

}

export default new TicketService()
