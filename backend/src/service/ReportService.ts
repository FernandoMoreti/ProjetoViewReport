import BankRepository from "../repository/BankRepository"
import ReportRepository from "../repository/ReportRepository"
import { getCurrentDayOfWeek } from "../utils/utils"

class ReportService {
    async getAll() {
        try {
            const reports = await ReportRepository.getAll()
            return reports
        } catch (error) {
            throw error
        }
    }

    async getAllByIntervalDate(dateOfReport: string, dateFinal: string) {
        try {
            const reports = await ReportRepository.getAllByIntervalDate(dateOfReport, dateFinal)
            return reports
        } catch (error) {
            throw error
        }
    }

    async getReportsByIntervalDate(bank: string, date: string, dateFinal: string) {
        try {

            const hasBank = await BankRepository.getIdByName(bank)

            if (!hasBank) {
                console.error("Banco invalido")
                return 'error'
            }
            const bankId = hasBank.dataValues.id

            const reports = await ReportRepository.getReportsByIntervalDate(bankId, date, dateFinal)
            return reports
        } catch (error) {
            throw error
        }
    }

    async getAllByDate(dateOfReport: string) {
        try {
            const reports = await ReportRepository.getAllByDate(dateOfReport)
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

    async getAllNotProcessed() {
        try {
            const reports = await ReportRepository.getAllNotProcessed()
            return reports
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async getAllLast30DaysByBank(bank: string) {
        try {
            const hasBank = await BankRepository.getIdByName(bank)

            if (!hasBank) {
                console.error("Banco invalido")
                return 'error'
            }

            const bankId = hasBank.dataValues.id

            const reports = await ReportRepository.getAllLast30DaysByBank(bankId)
            return reports
        } catch (error) {
            console.log(error)
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
            report.dayOfWeek = getCurrentDayOfWeek(report.dateOfReport)
        }

        const newReport = await ReportRepository.create(reports)
        return newReport
    }

    async update(reports: any[]) {
        try {
            for (let report of reports) {
                const { id, filename, processed, processedAt, received } = report
                await ReportRepository.update({ id, filename, processed, processedAt, received })
            }
            return 200
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async delete(id: any) {
        await ReportRepository.delete(id)

        return
    }
}

export default new ReportService()
