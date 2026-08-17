import { Op } from 'sequelize';
import { Proposal } from "../models"
import { ProposalAttriibutes } from "../Types/type"

export class ProposalRepository {
    async getAll(startDate: string, finalDate: string) {

        const start = `${startDate} 00:00:00`;
        const end = `${finalDate} 23:59:59`;

        try {
            return Proposal.findAll({
                raw: true,
                where: {
                    date: {
                        [Op.gte]: new Date(start),
                        [Op.lte]: new Date(end)
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

    async getPaginated(startDate: string, finalDate: string, page: number, limit: number): Promise<ProposalAttriibutes[]> {

        const start = `${startDate} 00:00:00`;
        const end = `${finalDate} 23:59:59`;

        try {
            const offset = (page - 1) * limit;

            const proposals: ProposalAttriibutes[] = await Proposal.findAll({
                where: {
                    date: {
                        [Op.gte]: new Date(start),
                        [Op.lte]: new Date(end)
                    }
                },
                limit: limit,
                offset: offset,
                raw: true
            })

            return proposals
        } catch(error: any) {
            throw error
        }
    }

    async isDuplicate(proposal: string, type: string, valComission: number) {
        try {
            const hasProposal = await Proposal.findOne({
                where: {
                    proposal: String(proposal),
                    typeCommission: type,
                    valCommission: valComission
                }
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