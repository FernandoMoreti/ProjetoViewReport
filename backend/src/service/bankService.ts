import BankRepository from "../repository/BankRepository"

class BankService {
    async getAll() {
        try {
            const banks = await BankRepository.getAll()
            return banks
        } catch (error) {
            throw error
        }
    }

    async getByName(bank: any) {
        return await BankRepository.getAll()
    }

    async create(bank: any) {
        const newBank = await BankRepository.create(bank)
        return newBank
    }

}

export default new BankService()
