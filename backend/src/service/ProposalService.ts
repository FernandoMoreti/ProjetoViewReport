import ProposalRepository from "../repository/ProposalRepository"
import { ProposalAttriibutes } from '../Types/type'

class ProposalService {
    async getAll(startDate: string, finalDate: string) {

        try {
            const proposals = await ProposalRepository.getAll(startDate, finalDate)
            return proposals
        } catch (error) {
            throw error
        }
    }

    async getPaginated(startDate: string, finalDate: string, page: number, limit: number): Promise<ProposalAttriibutes[]> {
        try {
            const proposals = await ProposalRepository.getPaginated(startDate, finalDate, page, limit)
            return proposals
        } catch(error: any) {
            throw error
        }
    }
    async getByName(bank: any) {
        // return await ProposalRepository.getByName(bank)
    }

    async create(proposals: ProposalAttriibutes[]) {

        try {
            for (let proposal of proposals) {
                proposal.duplicate = await ProposalRepository.isDuplicate(proposal.proposal, proposal.typeCommission, proposal.valCommission)
            }

            const newProposals = await ProposalRepository.create(proposals)
            return newProposals
        } catch (e) {
            console.log('Validado um erro do tipo: ', e)
            throw e
        }
    }

}

export default new ProposalService()
