import { Bank } from "../models/Bank"

export class BankRepository {
    async getAll() {
        try {
            return Bank.findAll()
        } catch (error) {
            throw error
        }
    }

    async getByName(bank: string) {
        try {
            return await Bank.findAll({
                where: {name: bank}
            })
        } catch (error) {
            throw error
        }
    }

    async getIdByName(bank: string) {
        try {
            const resbank = await Bank.findOne({
                where: {name: bank}
            })

            return resbank
        } catch (error) {
            throw error
        }
    }

    async create(bank: any) {
        try {
            const newBank = await Bank.create({name: bank})
            return newBank
        } catch (error) {
            throw error
        }
    }
}

export default new BankRepository()