import TicketRepository from "../repository/TicketRepository"

class TicketService {
    async getAll() {
        try {
            const banks = await TicketRepository.getAll()
            return banks
        } catch (error) {
            throw error
        }
    }

    async create(bank: string, dateOfTicket: string, about: string, numTicket: string, resolved: boolean) {
        const newBank = await TicketRepository.create(bank, dateOfTicket, about, numTicket, resolved)
        return newBank
    }

    async update(id: number, bank: string, dateOfTicket: string, about: string, numTicket: string, resolved: boolean) {
        try {
            await TicketRepository.update({ id, bank, dateOfTicket, about, numTicket, resolved})
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
