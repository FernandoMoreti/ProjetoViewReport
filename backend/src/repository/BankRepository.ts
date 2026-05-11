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
            console.log(bank)
            const bankFinded = await Bank.findOne({
                where: {name: bank}
            })
            console.log(bankFinded)
            return bankFinded
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