import { Report } from "../models/Report"

class ReportRepository {
    async getAll() {
        try {
            const reports = await Report.findAll()
            return reports
        } catch (error) {
            throw error
        }
    }

    async getReportsByDate(bankId: number, date: string) {
        try {
            const reports = await Report.findAll({
                where: {
                    bankId,
                    dateOfReport: date
                }
            })
            return reports
        } catch (error) {
            throw error
        }
    }

    async getReportByNameAndDate(date: string, bankId: number) {
        try {
            const reports = await Report.findOne({
                where: {
                    bankId,
                    dateOfReport: date
                }
            })
            return reports
        } catch (error) {
            throw error
        }
    }

    async create(reports: any[]) {
        try {

            if (!reports || reports.length === 0) {
                throw new Error("Nenhum dado fornecido para inserção.");
            }

            const newReport = await Report.bulkCreate(reports)
            return newReport
        } catch (error) {
            throw error
        }
    }
}

export default new ReportRepository()
