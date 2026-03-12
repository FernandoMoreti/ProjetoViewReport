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

    async update(banks: any[]) {
        try {
            for (let bank of banks) {
                const { id, name } = bank
                await BankRepository.update({ id, name })
            }
            return 200
        } catch (error) {
            console.error(error)
            throw error
        }
    }

}

export default new BankService()
