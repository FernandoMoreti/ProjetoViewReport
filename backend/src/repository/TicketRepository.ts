import { Ticket, TicketCashflow } from "../models"
import { TicketAtt, TicketCashflowAttributes } from "../Types/type";

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

    async getCashflow() {
        try {
            return TicketCashflow.findAll({
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

    async createCashflow(payload: Omit<TicketCashflowAttributes, 'id'>) {
        try {

            if (!payload) {
                throw new Error("Nenhum dado fornecido para inserção.");
            }

            const newTicket = await TicketCashflow.create(payload)
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

    async updateCashflow({ id, idParceiro, proposal, phone, obs, resolved }: TicketCashflowAttributes) {
        try {
            const newTicket = await TicketCashflow.update({
                idParceiro,
                proposal,
                phone,
                obs,
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