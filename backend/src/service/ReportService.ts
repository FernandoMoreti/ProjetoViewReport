import BankRepository from "../repository/BankRepository"
import ReportRepository from "../repository/ReportRepository"

class ReportService {
    async getAll() {
        try {
            const reports = await ReportRepository.getAll()
            return reports
        } catch (error) {
            throw error
        }
    }

    async getReportsByDate(bank: string, date: string) {
        try {

            const hasBank = await BankRepository.getIdByName(bank)

            if (!hasBank) {
                console.error("Banco invalido")
                return 'error'
            }
            const bankId = hasBank.dataValues.id

            const reports = await ReportRepository.getReportsByDate(bankId, date)
            return reports
        } catch (error) {
            throw error
        }
    }

    async create(bank: string, reports: any[]) {

        const hasBank = await BankRepository.getIdByName(bank)

        if (!hasBank) {
            console.error("Banco invalido")
            return 'error'
        }
        const bankId = hasBank.dataValues.id

        for (let report of reports) {
            report.bankId = bankId
        }

        const newReport = await ReportRepository.create(reports)
        return newReport
    }
}

export default new ReportService()
