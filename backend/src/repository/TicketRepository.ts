import { Ticket } from "../models"

interface TicketAtt {
    id: number;
    bank: string;
    dateOfTicket: string;
    about: string;
    numTicket: string;
    resolved: boolean;
}

export class TicketRepository {
    async getAll() {
        try {
            return Ticket.findAll()
        } catch (error) {
            console.error("Erro no repositório:", error);
            throw error;
        }
    }

    async create(bank: string, dateOfTicket: string, about: string, numTicket: string, resolved: boolean ) {
        try {
            const newTicket = await Ticket.create({
                bank,
                dateOfTicket,
                about,
                numTicket,
                resolved
            })
            return newTicket
        } catch (error) {
            throw error
        }
    }

    async update({ id, bank, dateOfTicket, about, numTicket, resolved }: TicketAtt) {
        try {
            const newTicket = await Ticket.update({
                bank,
                dateOfTicket,
                about,
                numTicket,
                resolved
            }, {
                where: {
                    id: id
                }
            })
            return newTicket
        } catch (error) {
            throw error
        }
    }

    async delete(id: number) {
        try {
            return await Ticket.destroy({
                where: {
                    id
                }
            })
        } catch (error) {
            throw error
        }
    }
}

export default new TicketRepository()