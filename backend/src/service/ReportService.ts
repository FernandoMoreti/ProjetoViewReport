import BankRepository from "../repository/BankRepository"
import ReportRepository from "../repository/ReportRepository"
import { getCurrentDayOfWeek, findBank } from "../utils/utils"
import { read_excel } from '../utils/utils'
import { PropReport } from "../Types/type"
import { BANCOS_MAIS_LOJAS } from "../config/DePara/DePara"

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

    async validReport(file: Express.Multer.File) {
        try {
            const df = await read_excel(file.buffer) as PropReport[]

            const grupos = Object.groupBy(df, (item: PropReport) => item.Banco as string);

            const listaWork = grupos['WORKBANK']

            for (let item of listaWork!) {
                const nameBank = item.Arquivo.split("-")[0].trim()
                const bank = findBank(nameBank)

                const destino = bank || 'OUTROS';

                if (!grupos[destino]) {
                    grupos[destino] = [];
                }

                grupos[destino].push(item);
            }

            delete grupos['WORKBANK'];

            for (let banco of BANCOS_MAIS_LOJAS) {
                if (banco == "BMG") {
                    for (let i of grupos["BMG"]!) {
                        if (i.Arquivo.includes("53259")) {
                            console.log(i.Arquivo)
                        }
                    }
                }
            }

            return
        } catch (e) {
            console.error(e)
            return
        }
    }
}

export default new ReportService()
