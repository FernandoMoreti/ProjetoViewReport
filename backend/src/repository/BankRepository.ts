import { Bank } from "../models"

interface BankAtt {
    id: number
    name: string
}

export class BankRepository {
    async getAll() {
        try {
            return Bank.findAll({
                order: [
                    ['name', 'ASC']
                ]
            })
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

    async create(name: any[]) {
        try {

            if (!name || name.length === 0) {
                throw new Error("Nenhum dado fornecido para inserção.");
            }

            const newBank = await Bank.bulkCreate(name)
            return newBank
        } catch (error) {
            throw error
        }
    }

    async update({ id, name }: BankAtt) {
        try {
            const newReport = await Bank.update({
                name
            }, {
                where: {
                    id: id
                }
            })
            return newReport
        } catch (error) {
            throw error
        }
    }
}

export default new BankRepository()