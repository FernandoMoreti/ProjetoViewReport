import { Op } from 'sequelize';
import { Proposal } from "../models"
import { ProposalAttriibutes } from "../Types/type"

export class ProposalRepository {
    async getAll(startDate: string, finalDate: string) {

        const endOfDay = `${finalDate}T23:59:59.999Z`

        try {
            return Proposal.findAll({
                where: {
                    created_at: {
                        [Op.gte]: new Date(startDate),
                        [Op.lte]: new Date(endOfDay)
                    }
                },
                order: [
                    ['bank', 'ASC']
                ]
            })
        } catch (error) {
            throw error
        }
    }

    async isDuplicate(proposal: string, type: string) {
        try {
            const hasProposal = await Proposal.findOne({
                where: {proposal: String(proposal), typeCommission: type}
            })

            if (!hasProposal) {
                return false
            }
            return true
        } catch (error) {
            throw error
        }
    }

    async getIdByName(bank: string) {
        // try {
        //     const resbank = await Proposal.findOne({
        //         where: {name: bank}
        //     })

        //     return resbank
        // } catch (error) {
        //     throw error
        // }
    }

    async create(proposals: ProposalAttriibutes[]) {
        try {

            if (!proposals || proposals.length === 0) {
                throw new Error("Nenhum dado fornecido para inserção.");
            }

            try {
                const newProposals = await Proposal.bulkCreate(proposals);
                return newProposals;
            } catch (error: any) {
                console.error("Erro no Sequelize:", error.name, error.message);
                
                if (error.errors) {
                    console.error("Detalhes da validação:", error.errors.map((e: any) => e.message));
                }
                
                throw error;
            }
        } catch (error) {
            throw error
        }
    }
}

export default new ProposalRepository()