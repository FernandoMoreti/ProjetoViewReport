import ProposalRepository from "../repository/ProposalRepository"
import { ProposalAttriibutes } from '../Types/type'

class ProposalService {
    async getAll(startDate: string, finalDate: string) {

        try {
            const banks = await ProposalRepository.getAll(startDate, finalDate)
            return banks
        } catch (error) {
            throw error
        }
    }

    async getByName(bank: any) {
        // return await ProposalRepository.getByName(bank)
    }

    async create(proposals: ProposalAttriibutes[]) {

        try {
            for (let proposal of proposals) {
                proposal.duplicate = await ProposalRepository.isDuplicate(proposal.proposal, proposal.typeCommission)
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
