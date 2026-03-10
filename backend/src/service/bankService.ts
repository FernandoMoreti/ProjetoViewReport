import BankRepository from "../repository/BankRepository"

class BankService {
    async index() {
        console.log("Service acessado com sucesso")
        return await BankRepository.index()
    }
}

export default new BankService()
