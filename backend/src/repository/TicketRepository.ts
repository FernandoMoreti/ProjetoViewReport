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
    async getNotResolved() {
        try {
            return Ticket.findAll({
                where: {
                    resolved: false
                }
            })
        } catch (error) {
            console.error("Erro no repositório:", error);
            throw error;
        }
    }

    async getResolved() {
        try {
            return Ticket.findAll({
                where: {
                    resolved: true
                }
            })
        } catch (error) {
            console.error("Erro no repositório:", error);
            throw error;
        }
    }

    async create(tickets: any[]) {
        try {

            if (!tickets || tickets.length === 0) {
                throw new Error("Nenhum dado fornecido para inserção.");
            }

            const newTicket = await Ticket.bulkCreate(tickets)
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